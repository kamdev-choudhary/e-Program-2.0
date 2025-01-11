import { Box, Paper, Button, Typography, IconButton } from "@mui/material";
import React, { useMemo, useState } from "react";
import axios from "../../hooks/AxiosInterceptor";
import saveAs from "file-saver";
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
import { baseUrl } from "../../config/environment";

interface ScholarData {
  drn: string;
  day: string;
  month: string;
  application: string;
  year: string;
  pdfUrl: string;
  city: string;
  date: string;
}

interface DownloadJsonToExcelProps {
  jsonData: Record<string, any>[];
  fileName?: string;
}

const DownloadCityInformation: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ScholarData[] | null>(null);

  const downloadJsonToExcel = async ({
    jsonData,
    fileName = "data.xlsx",
  }: DownloadJsonToExcelProps) => {
    if (!jsonData || jsonData.length === 0) {
      console.error("No data to export");
      return;
    }

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Extract headers from the first object's keys
    const headers = Object.keys(jsonData[0]);

    // Add headers to the worksheet
    worksheet.addRow(headers);

    // Add data rows
    jsonData.forEach((row) => {
      const rowData = headers.map((header) => row[header] ?? null); // Ensure data corresponds to headers
      worksheet.addRow(rowData);
    });

    // Adjust column widths
    worksheet.columns.forEach((column) => {
      const maxLength =
        column.values?.reduce(
          (max: number, value: any) =>
            Math.max(max, value?.toString().length || 0),
          0
        ) || 10;
      column.width = maxLength + 2; // Add padding
    });

    try {
      // Generate Excel file as a blob
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Use FileSaver.js to save the file
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  const downloadPdf = async (scholar: ScholarData): Promise<void> => {
    try {
      const response = await fetch(scholar.pdfUrl);
      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, `${scholar.drn}_${scholar.application}`);
      } else {
        console.error(
          `Failed to fetch the PDF file from URL: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error while downloading the PDF:", error);
    }
  };

  const handleDownloadCityInfo = async (scholar: ScholarData) => {
    try {
      // Request to get the PDF file path
      const response = await axios.post("/automation/jee", {
        drn: scholar.drn,
        day: scholar.day,
        month: scholar.month,
        year: scholar.year,
        applicationNumber: scholar.application,
      });

      if (response.data?.pdfUrl) {
        setJsonData((prevData) => {
          if (!prevData) return null; // If jsonData is null, maintain null state
          return prevData.map((item) =>
            item.drn === scholar.drn
              ? {
                  ...item,
                  pdfUrl: `${baseUrl}${response.data.pdfUrl}`,
                  date: response.data.date,
                  city: response.data.city,
                }
              : item
          );
        });
      } else {
        console.error(
          "PDF URL or data fields are not available in the response."
        );
      }
    } catch (error) {
      console.error("Error downloading the PDF:", error);
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
            if (!data.pdfUrl) {
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
            day: rowData.day || "",
            month: rowData.month || "",
            year: rowData.year || "",
            application: rowData.application || "",
            pdfUrl: rowData.pdfUrl || "",
            city: rowData.city || "",
            date: rowData.date || "",
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

  const rows = useMemo(
    () =>
      jsonData?.map((data, index) => ({
        ...data,
        id: index + 1,
      })) || [],
    [jsonData]
  );

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
      editable: true,
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
      field: "day",
      headerName: "Day",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "month",
      headerName: "Month",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "year",
      headerName: "Year",
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
      editable: true,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Exam Date",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "d",
      headerName: "PDF",
      align: "center",
      headerAlign: "center",
      editable: true,
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
              onClick={() => downloadPdf(params.row)}
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
      editable: true,
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => handleDownloadCityInfo(params.row)}
            startIcon={<CloudDownloadRounded />}
            color="success"
          >
            Fetch Data
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2, height: "70vh" }}>
      <Paper>
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
            >
              Download PDF
            </Button>
            <Button
              startIcon={<DownloadRounded />}
              variant="contained"
              component="a"
              href="/sample.xlsx" // Path to the file in the public folder
              download // Enables direct download
            >
              Sample
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <DataGrid
            slots={{
              toolbar: () => <CustomToolbar showAddButton={false} />,
            }}
            columns={columns}
            rows={rows}
            loading={isLoading}
            sx={{
              "& .MuiDataGrid-columnHeader": {
                bgcolor: "#28844f", // Light background color for the header
                color: "primary.contrastText", // Text color for the header
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold", // Make header text bold
              },
            }}
            processRowUpdate={handleProcessRowUpdate}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 30, 50, 100, 200]}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default DownloadCityInformation;
