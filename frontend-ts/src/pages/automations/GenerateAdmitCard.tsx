import {
  Box,
  Button,
  Card,
  CircularProgress,
  ToggleButton,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  ManageHistoryRounded,
  StackedBarChartRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import FileDropZone from "../../components/FileDropZone";
import { downloadJsonToExcel } from "../../utils/commonfs";
import axios from "../../hooks/AxiosInterceptor";

// Dynamic interface using Record
type ScholarData = Record<string, any>;

const DownloadAdmitCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const getColumnsFromHeaders = (headers: string[]): GridColDef[] => {
    const dynamicColumns: GridColDef[] = headers.map((header) => ({
      field: header,
      headerName: header,
      width: 150, // Adjust based on your requirements
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    }));

    // Add the 'status' and 'error' columns
    const additionalColumns: GridColDef[] = [
      {
        field: "status",
        headerName: "Status",
        align: "center",
        headerAlign: "center",
        editable: false, // Usually, 'status' is not editable
        flex: 1,
        type: "string", // Ensure 'type' is specified to match GridColDef expectations
        minWidth: 150,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%", // Ensure it spans the full cell width
              height: "100%", // Ensure it spans the full cell height
            }}
          >
            <Button
              size="small"
              disabled={
                params.row.status === "generated" ||
                params.row.status === "loading"
              }
              startIcon={
                params.row.status === "loading" ? (
                  <CircularProgress size={20} />
                ) : (
                  <ManageHistoryRounded />
                )
              }
              variant="contained"
              onClick={() => handleDownloadAdmitCard(params.row)}
            >
              {params.row.status === "generated" ? "Generated" : "Generate"}
            </Button>
          </Box>
        ),
      },

      {
        field: "error",
        headerName: "Error",
        width: 250,
        align: "center",
        headerAlign: "center",
        editable: false, // 'error' is typically read-only
        flex: 2,
        type: "string", // Ensure 'type' is specified for consistency
        renderCell: (params) => (
          <>
            <span style={{ color: "red" }}>{params.row.error}</span>
          </>
        ),
      },
    ];

    return [...dynamicColumns, ...additionalColumns]; // Concatenate dynamic columns with status and error
  };

  const handleDownloadAdmitCard = async (scholar: ScholarData) => {
    try {
      setJsonData((prevData) => {
        if (!prevData) return [];
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                status: "loading", // Update status to loading
                error: "",
              }
            : item
        );
      });

      const response = await axios.post("/automation/generate/admitcard", {
        student: scholar,
      });

      if (response.data?.status_code === 1) {
        setJsonData((prevData) => {
          if (!prevData) return [];
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  date: response.data.date,
                  error: "",
                  status: "generated", // Update status to generated
                }
              : item
          );
        });
      } else if (response.data?.error) {
        setJsonData((prevData) => {
          if (!prevData) return [];
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  error: response.data.error,
                  status: "idle", // Reset to idle if there's an error
                }
              : item
          );
        });
      }
    } catch (error: any) {
      console.error("Error downloading the PDF:", error);
      setJsonData((prevData) => {
        if (!prevData) return [];
        const errorMessage = error?.response?.data?.message || "Unknown error";
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                error: errorMessage,
                status: "idle", // Reset to idle on error
              }
            : item
        );
      });
    }
  };

  const handleDownloadInfo = async () => {
    try {
      if (jsonData) {
        await Promise.all(
          jsonData.map(async (data) => {
            if (data?.status === "idle") {
              await handleDownloadAdmitCard(data);
            }
          })
        );
      }
    } catch (error) {
      console.error("Error handling download info:", error);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsLoading(true);

    const file = acceptedFiles[0];
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target?.result;
      if (!(buffer instanceof ArrayBuffer)) {
        setIsLoading(false);
        console.error("FileReader result is not an ArrayBuffer.");
        return;
      }

      try {
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const rows: Array<any[]> = [];
        worksheet.eachRow((row) => {
          const rowValues = Array.isArray(row.values)
            ? row.values.slice(1)
            : [];
          rows.push(rowValues);
        });

        if (rows.length === 0) {
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const [headers, ...dataRows] = rows;

        // Dynamically create ScholarData from the rows
        const json: ScholarData[] = dataRows.map((row, index) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as ScholarData); // Using ScholarData as Record

          return {
            ...rowData,
            status: "idle", // Default status
            error: "",
            id: index + 1,
          };
        });

        setJsonData(json);

        // Set columns dynamically based on the first row's headers
        const dynamicColumns = getColumnsFromHeaders(headers);
        setColumns(dynamicColumns);
      } catch (error) {
        console.error("Error reading the Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProcessRowUpdate = (
    newRow: ScholarData,
    oldRow: ScholarData
  ): ScholarData => {
    setJsonData((prevData) => {
      if (!prevData) return [];
      return prevData.map((item) =>
        item.drn === oldRow.drn ? { ...item, ...newRow } : item
      );
    });

    return newRow;
  };

  const filteredData = useMemo(() => {
    if (!jsonData) return [];

    return jsonData.filter((data) => {
      if (selectedStatus === "loading" || selectedStatus === "fetched") {
        return data.status === selectedStatus;
      } else if (selectedStatus === "error") {
        return data.error !== "";
      } else {
        return true; // Include all data for other cases
      }
    });
  }, [jsonData, selectedStatus]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx", "xls"]} />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            sx={{ px: 3 }}
            variant="contained"
            onClick={handleDownloadInfo}
            disabled={isLoading || !jsonData}
            startIcon={<ManageHistoryRounded />}
          >
            {isLoading ? "Loading..." : "Generate All"}
          </Button>
          <Button
            onClick={() =>
              downloadJsonToExcel({
                jsonData: jsonData,
                fileName: "Admit_card_generation_report",
              })
            }
            variant="contained"
            startIcon={<StackedBarChartRounded />}
          >
            Download Report
          </Button>
        </Box>
      </Box>
      <Card
        elevation={4}
        sx={{
          p: 0, // Add padding inside the card for consistent spacing
        }}
      >
        <Box
          sx={{
            display: "flex",
            p: 1.5,
            gap: 2,
            justifyContent: "space-between",
            px: 2,
            overflow: "auto",
          }}
        >
          <ToggleButton
            size="small"
            value="total"
            color="primary"
            aria-label="Platform"
            selected={selectedStatus === ""}
            onClick={() => setSelectedStatus("")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Total &nbsp;&nbsp;</strong> ({jsonData?.length || 0})
          </ToggleButton>
          <ToggleButton
            size="small"
            value="total"
            color="success"
            aria-label="Platform"
            selected={selectedStatus === "generated"}
            onClick={() => setSelectedStatus("generated")}
            sx={{ px: 4, minWidth: 200 }}
          >
            <strong>Generated &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "generated").length ||
              0}
            )
          </ToggleButton>
          <ToggleButton
            size="small"
            value="total"
            color="primary"
            aria-label="Platform"
            selected={selectedStatus === "loading"}
            onClick={() => setSelectedStatus("loading")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Loading &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "loading").length || 0})
          </ToggleButton>
          <ToggleButton
            size="small"
            value="total"
            color="error"
            aria-label="Platform"
            selected={selectedStatus === "error"}
            onClick={() => setSelectedStatus("error")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Error &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item?.error !== "").length || 0})
          </ToggleButton>
        </Box>
      </Card>

      <DataGrid
        slots={{
          toolbar: () => <CustomToolbar showAddButton={false} />,
        }}
        columns={columns}
        rows={filteredData}
        loading={isLoading}
        processRowUpdate={handleProcessRowUpdate}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 30, 50, 100, 200]}
        sx={{ background: "background.paper" }}
      />
    </Box>
  );
};

export default DownloadAdmitCard;
