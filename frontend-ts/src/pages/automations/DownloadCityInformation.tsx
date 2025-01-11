import { Box, Paper, Button, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import axios from "../../hooks/AxiosInterceptor"; // Assuming this is your custom Axios instance
import saveAs from "file-saver";
import { useDropzone } from "react-dropzone";
import ExcelJS from "exceljs";
import { DataGrid, GridColDef } from "@mui/x-data-grid"; // Ensure proper import for columns

type JsonDataType = Array<Record<string, any>>;

interface ScholarData {
  drn: string;
  day: string;
  month: string;
  application: string;
  yaar: string;
}

const DownloadCityInformation: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<JsonDataType | null>(null);

  const downloadPdf = async (url: string): Promise<void> => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        // Convert the response to a blob and download
        const blob = await response.blob();
        saveAs(blob, "downloaded-file.pdf");
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
        year: scholar.yaar,
        application: scholar.application,
      });

      if (response.data?.pdfUrl) {
        downloadPdf(response.data.pdfUrl);
      } else {
        console.error("PDF URL not available in the response.");
      }
    } catch (error) {
      console.error("Error downloading the PDF:", error);
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
            : []; // Check if row.values is an array
          rows.push(rowValues);
        });

        if (rows.length === 0) {
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        // Assuming the first row contains headers
        const [headers, ...dataRows] = rows;
        const json: JsonDataType = dataRows.map((row) => {
          if (!headers) return {};
          return headers.reduce(
            (acc: Record<string, any>, header: any, index: number) => {
              acc[String(header)] = row ? row[index] || null : null; // Safely handle undefined row
              return acc;
            },
            {}
          );
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

  // Memoize rows to optimize rendering
  const rows = useMemo(() => {
    return (
      jsonData?.map((data, index) => ({
        ...data,
        id: index + 1,
        city: "",
        date: "",
        pdfUrl: "",
      })) || []
    );
  }, [jsonData]);

  // Define columns for DataGrid dynamically based on the jsonData headers
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
    },
    {
      field: "drn",
      headerName: "Dakshana Roll #",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "application",
      headerName: "Application #",
    },
    {
      field: "day",
      headerName: "Day",
    },
    {
      field: "month",
      headerName: "Month",
    },
    {
      field: "year",
      headerName: "Year",
    },
    {
      field: "city",
      headerName: "City",
    },
    {
      field: "date",
      headerName: "Exam Date",
    },
    {
      field: "pdfUrl",
      headerName: "PDF Link",
    },
    { field: "fetchAgain", headerName: "Fetch Again" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Paper>
        <Box>
          <Box
            {...getRootProps()}
            sx={{
              padding: 4,
              textAlign: "center",
              border: "2px dashed #1976d2",
              borderRadius: 2,
              width: "100%",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body1">
              Drag & drop an Excel file here, or click to select a file
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleDownloadCityInfo}
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? "Loading..." : "Fetch All Data"}
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: 400, mt: 2 }}>
          <DataGrid columns={columns} rows={rows} loading={isLoading} />
        </Box>
      </Paper>
    </Box>
  );
};

export default DownloadCityInformation;
