import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  ToggleButton,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  CloudDownloadRounded,
  CloudUploadRounded,
  DownloadRounded,
  LaunchRounded,
  PictureAsPdfRounded,
  TableChartRounded,
} from "@mui/icons-material";
import { CustomToolbar } from "../../components/CustomToolbar";
import { downloadJsonToExcel, downloadPdfFromUrl } from "../../utils/commonfs";
import axios from "../../hooks/AxiosInterceptor";

interface ScholarData {
  drn: string;
  application: string;
  password: string;
  pdfUrl: string;
  city: string;
  date: string;
  name?: string;
  status?: string;
  error?: string;
}

const JEEMainCityInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleDownloadCityInfo = async (scholar: ScholarData) => {
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
      const response = await axios.post("/automation/jee/cityinfo", {
        drn: scholar.drn,
        application: scholar.application,
        password: scholar.password,
      });

      if (response.data?.success) {
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  pdfUrl: response.data.pdfUrl,
                  date: response.data.date,
                  city: response.data.city,
                  error: "",
                  status: "success",
                }
              : item
          );
        });
      } else {
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

  const handleDownloadAddPdf = async () => {
    try {
      if (jsonData) {
        // Use Promise.all to wait for all promises to resolve
        await Promise.all(
          jsonData.map(async (data) => {
            if (data.pdfUrl) {
              await handleDownloadCityInfo(data);
            }
          })
        );
      }
    } catch (error) {
      console.error("Error handling download info:", error);
    }
  };

  const handleDownloadInfo = async () => {
    try {
      if (jsonData) {
        await Promise.all(
          jsonData.map(async (data) => {
            if (!data.pdfUrl && data?.status === "idle") {
              // Fetch the missing PDF URL if not available
              await handleDownloadCityInfo(data);
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
            password: rowData.password || "",
            application: rowData.application || "",
            pdfUrl: rowData.pdfUrl || "",
            city: rowData.city || "",
            date: rowData.date || "",
            error: "",
            status: "idle",
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

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
      field: "id",
      headerName: "SN",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
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
      field: "name",
      headerName: "Name",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },

    {
      field: "password",
      headerName: "Password",
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Exam Date",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "d",
      headerName: "PDF",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 0.5 }}
          >
            {/* Open PDF Button */}
            <IconButton
              component="a"
              href={params.row.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!params.row.pdfUrl}
            >
              <LaunchRounded sx={{ color: params.row.pdfUrl ? "blue" : "" }} />
            </IconButton>
            {/* Download PDF Button */}
            <IconButton
              disabled={!params.row.pdfUrl}
              onClick={() =>
                downloadPdfFromUrl(
                  params.row.pdfUrl,
                  `${params.row.application}`
                )
              }
            >
              <DownloadRounded
                sx={{ color: params.row.pdfUrl ? "green" : "" }}
              />
            </IconButton>
          </Box>
        </>
      ),
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
          <Button
            onClick={() => handleDownloadCityInfo(params.row)}
            startIcon={
              params.row.status === "loading" ? (
                <CircularProgress size={20} />
              ) : (
                <CloudDownloadRounded />
              )
            }
            color="success"
            disabled={
              params.row.status === "success" || params.row.status === "loading"
            }
            variant="outlined"
          >
            {params.row.status === "loading" ? "loading" : "Fetch Data"}
          </Button>
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
        if (selectedStatus === "loading" || selectedStatus === "success") {
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

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: "1px dashed #1976d2",
            borderRadius: 20,
            cursor: "pointer",
            flexGrow: 1,
            alignContent: "center",
            p: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadRounded sx={{ mr: 1 }} />
          <Typography variant="body1">
            Drag & drop an Excel file here, or click to select a file
          </Typography>
        </Box>
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
            {jsonData?.filter((data) => !data.pdfUrl).length})
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
            Download Excel ({jsonData?.filter((data) => data.pdfUrl).length})
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PictureAsPdfRounded sx={{ color: "#fff" }} />}
            onClick={handleDownloadAddPdf}
            sx={{ px: 3 }}
            disabled={
              !jsonData ||
              jsonData.filter((data) => data?.pdfUrl?.trim() !== "").length ===
                0
            }
          >
            Download PDF
          </Button>
          <Button
            startIcon={<DownloadRounded />}
            variant="contained"
            component="a"
            href="/sample1.xlsx"
            download
          >
            Sample
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          overflow: "auto",
          flexWrap: "wrap",
          mt: 2,
        }}
      >
        <ToggleButton
          value="total"
          aria-label="Platform"
          selected={selectedStatus === ""}
          onClick={() => setSelectedStatus("")}
          sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
          size="small"
        >
          <strong>Total &nbsp;&nbsp;</strong> ({jsonData?.length || 0})
        </ToggleButton>
        <ToggleButton
          value="total"
          color="success"
          aria-label="Platform"
          selected={selectedStatus === "success"}
          onClick={() => setSelectedStatus("success")}
          size="small"
          sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
        >
          <strong>Success &nbsp;&nbsp;</strong> (
          {jsonData?.filter((item) => item.status === "success").length || 0})
        </ToggleButton>
        <ToggleButton
          color="primary"
          value="total"
          aria-label="Platform"
          selected={selectedStatus === "loading"}
          onClick={() => setSelectedStatus("loading")}
          size="small"
          sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
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
          sx={{ px: 4, minWidth: 150, flexGrow: 1, maxWidth: 200 }}
        >
          <strong>Error &nbsp;&nbsp;</strong>(
          {jsonData?.filter((item) => item?.error !== "").length || 0})
        </ToggleButton>
      </Box>
      <Box sx={{ mt: 2 }}>
        <DataGrid
          slots={{
            toolbar: () => <CustomToolbar />,
          }}
          columns={columns}
          rows={filteredData}
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

export default JEEMainCityInfo;
