import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "../../hooks/AxiosInterceptor";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  CloudDownloadRounded,
  ManageHistoryRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import FileDropZone from "../../components/FileDropZone";

// Dynamic interface using Record
type ScholarData = Record<string, any>;

const DownloadAdmitCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);
  const [columns, setColumns] = useState<GridColDef[]>([]);

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
        if (!prevData) return null;
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                status: "loading", // Update status to loading
              }
            : item
        );
      });

      const response = await axios.post("/automation/generate/admitcard", {
        student: scholar,
      });

      if (response.data?.status_code === 1) {
        setJsonData((prevData) => {
          if (!prevData) return null;
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
          if (!prevData) return null;
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
        if (!prevData) return null;
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
        const json: ScholarData[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as ScholarData); // Using ScholarData as Record

          return {
            ...rowData,
            status: "idle", // Default status
            error: "",
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
      if (!prevData) return null;
      return prevData.map((item) =>
        item.drn === oldRow.drn ? { ...item, ...newRow } : item
      );
    });

    return newRow;
  };

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
            startIcon={<CloudDownloadRounded sx={{ color: "#fff" }} />}
          >
            {isLoading ? "Loading..." : "Fetch Data"}
          </Button>
        </Box>
      </Box>
      <Card
        sx={{
          p: 0, // Add padding inside the card for consistent spacing
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between", // Distribute items evenly
            alignItems: "center", // Align items vertically
            mt: 1,
            px: 4,
          }}
        >
          <Typography variant="body1">
            <strong>Total Count:</strong> {jsonData?.length || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Generated Count:</strong>{" "}
            {jsonData?.filter((item) => item.status === "generated").length ||
              0}
          </Typography>
          <Typography variant="body1">
            <strong>Loading Count:</strong>{" "}
            {jsonData?.filter((item) => item.status === "loading").length || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Error Count:</strong>{" "}
            {jsonData?.filter((item) => item.error !== "").length || 0}
          </Typography>
        </CardContent>
      </Card>

      <Box>
        <DataGrid
          slots={{
            toolbar: () => <CustomToolbar showAddButton={false} />,
          }}
          columns={columns}
          rows={jsonData || []}
          loading={isLoading}
          processRowUpdate={handleProcessRowUpdate}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 30, 50, 100, 200]}
          getRowId={(row) => row.drn}
        />
      </Box>
    </Box>
  );
};

export default DownloadAdmitCard;
