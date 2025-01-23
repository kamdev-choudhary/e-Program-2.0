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
  DownloadRounded,
  TableChartRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel } from "../../utils/commonfs";
import FileDropZone from "../../components/FileDropZone";

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
}

const DownloadAdmitCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);

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
      const response = await axios.post("/automation/jee/admitcard", {
        drn: scholar.drn,
        applicationNumber: scholar.application,
        password: scholar.password,
      });

      if (response.data.success) {
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
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
                }
              : item
          );
        });
      } else if (response.data?.error) {
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
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
      console.error("Error downloading the PDF:", error);
      setJsonData((prevData) => {
        if (!prevData) return null; // If jsonData is null, maintain null state
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
                  fileName: "JEE Main City Info",
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
            {jsonData?.filter((item) => item.status === "fetched").length || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Loading Count:</strong>{" "}
            {jsonData?.filter((item) => item.status === "loading").length || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Error Count:</strong>{" "}
            {jsonData?.filter((item) => item?.error !== "").length || 0}
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
