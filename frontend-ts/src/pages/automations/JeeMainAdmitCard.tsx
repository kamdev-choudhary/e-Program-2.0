import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  ToggleButton,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  CloudDownloadRounded,
  DownloadRounded,
  TableChartRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import FileDropZone from "../../components/FileDropZone";
import axios from "../../hooks/AxiosInterceptor";
import { useLocation } from "react-router-dom";

interface ScholarData {
  drn: string;
  application: string;
  password?: string;
  city: string;
  status?: string;
  date?: string;
  shift?: string;
  timing?: string;
  center?: string;
  address?: string;
  error: string;
  rollNumber: string;
}

const JEEMainAdmitCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const location = useLocation();

  const handleDownloadAdmitCard = async (scholar: ScholarData) => {
    try {
      setJsonData((prevData) => {
        if (!prevData) return null; // If jsonData is null, maintain null state
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                status: "loading",
                error: "",
              }
            : item
        );
      });
      // Request to get the PDF file path
      const response = await axios.get(`/automation/jee/admitcard`, {
        params: {
          drn: scholar.drn,
          application: scholar.application,
          password: scholar.password,
        },
      });

      if (response.data.success) {
        setJsonData((prevData) => {
          if (!prevData) return null;
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  date: response.data.date,
                  error: "",
                  status: "fetched",
                  shift: response.data.shift,
                  timing: response.data.timing,
                  center: response.data.center,
                  address: response.data.address,
                  rollNumber: response.data.rollNumber,
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
                  status: "idle",
                }
              : item
          );
        });
      }
    } catch (error: any) {
      setJsonData((prevData) => {
        if (!prevData) return null;
        const errorMessage = error?.response?.data?.message || "Unknown error";
        return prevData.map((item) =>
          item.drn === scholar.drn
            ? {
                ...item,
                error: errorMessage,
                status: "idle",
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
            if (!data.center && data?.status === "idle") {
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
          if (!row.values) return; // Ensure row.values is defined

          const rowValues = Array.isArray(row.values)
            ? row.values.slice(1)
            : [];

          // Convert hyperlink/email cells to plain text if needed
          const processedRow = rowValues.map((cell) => {
            if (typeof cell === "object" && cell !== null && "text" in cell) {
              return cell.text; // Extract the plain text from a hyperlink/email
            }
            return cell ?? ""; // Ensure no `undefined` values
          });

          rows.push(processedRow);
        });

        if (rows.length === 0) {
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const [headers, ...dataRows] = rows;
        const json: ScholarData[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as Partial<ScholarData>);

          return {
            drn: rowData.drn || "",
            application: rowData.application || "",
            password: rowData.password || "",
            city: rowData.city || "",
            date: rowData.date || "",
            error: "",
            status: "idle",
            shift: "",
            timing: "",
            center: "",
            address: "",
            rollNumber: "",
          };
        });

        setJsonData(json);
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
      if (!prevData) return null; // Handle case when prevData is null
      return prevData.map((item) =>
        item.drn === oldRow.drn
          ? { ...item, ...newRow } // Update the matching row
          : item
      );
    });

    return newRow;
  };

  const columns: GridColDef[] = [
    {
      field: "drn",
      headerName: "Dakshana Roll #",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "application",
      headerName: "Application #",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "password",
      headerName: "Password",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "timing",
      headerName: "Timimg",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "shift",
      headerName: "Shift",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "center",
      headerName: "Center",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "pdfDownload",
      headerName: "Data",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <>
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
              onClick={() => handleDownloadAdmitCard(params.row)}
              startIcon={
                params.row.status === "loading" ? (
                  <CircularProgress size={20} />
                ) : (
                  <CloudDownloadRounded />
                )
              }
              disabled={
                params.row.status === "fetched" ||
                params.row.status === "loading"
              }
              variant="outlined"
            >
              {params.row.status === "loading" ? "loading" : "Fetch Data"}
            </Button>
          </Box>
        </>
      ),
    },
    {
      field: "error",
      headerName: "Error",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <span style={{ color: "red" }}>{params.row.error}</span>
        </>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (!jsonData) return [];

    return jsonData
      .filter((data) => {
        if (selectedStatus === "loading" || selectedStatus === "fetched") {
          return data.status === selectedStatus;
        } else if (selectedStatus === "error") {
          return data.error !== "";
        } else {
          return true; // Include all data for other cases
        }
      })
      .map((data, index) => ({
        ...data,
        id: index + 1, // Add an id field based on the index (1-based)
      }));
  }, [jsonData, selectedStatus]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (jsonData) {
        downloadJsonToExcel({
          jsonData: jsonData,
          fileName: "JEE Main AdmitCard Info",
        });
      }
    };

    // Listen for route changes
    return () => {
      handleRouteChange();
    };
  }, [location]);

  // Handle Tab Close or Page Refresh
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      if (jsonData) {
        downloadJsonToExcel({
          jsonData: jsonData,
          fileName: "JEE Main AdmitCard Info",
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [jsonData]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              {isLoading ? "Loading..." : "Fetch Data"} (
              {jsonData?.filter((data) => !data.center).length})
            </Button>
            <Button
              startIcon={<TableChartRounded />}
              sx={{ px: 3 }}
              variant="contained"
              disabled={!jsonData}
              onClick={() => {
                if (jsonData) {
                  downloadJsonToExcel({
                    jsonData: jsonData,
                    fileName: "JEE Main AdmitCard Info",
                  });
                }
              }}
            >
              Download Excel ({jsonData?.filter((data) => data.center).length})
            </Button>

            <Button
              startIcon={<DownloadRounded />}
              variant="contained"
              component="a"
              href="/jee_main_admit_card_sample.xlsx"
              download
            >
              Sample
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",

            gap: 2,
            justifyContent: "space-between",
            px: 2,
            overflow: "auto",
          }}
        >
          <ToggleButton
            value="total"
            color="success"
            aria-label="Platform"
            selected={selectedStatus === ""}
            onClick={() => setSelectedStatus("")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Total &nbsp;&nbsp;</strong> ({jsonData?.length || 0})
          </ToggleButton>
          <ToggleButton
            value="total"
            color="primary"
            aria-label="Platform"
            selected={selectedStatus === "fetched"}
            onClick={() => setSelectedStatus("fetched")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>fetched &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "fetched").length || 0})
          </ToggleButton>
          <ToggleButton
            value="total"
            aria-label="Platform"
            selected={selectedStatus === "loading"}
            onClick={() => setSelectedStatus("loading")}
            sx={{ px: 4, minWidth: 150 }}
          >
            <strong>Loading &nbsp;&nbsp;</strong> (
            {jsonData?.filter((item) => item.status === "loading").length || 0})
          </ToggleButton>
          <ToggleButton
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
      </Paper>

      <Box>
        <DataGrid
          slots={{
            toolbar: () => <CustomToolbar />,
          }}
          columns={columns}
          rows={filteredData || []}
          loading={isLoading}
          processRowUpdate={handleProcessRowUpdate}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 30, 50, 100, 200]}
        />
      </Box>
    </Box>
  );
};

export default JEEMainAdmitCard;
