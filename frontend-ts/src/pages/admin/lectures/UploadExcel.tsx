import { CloudUploadRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import * as ExcelJS from "exceljs";

interface LectureData {
  drn: string;
  day: string;
  month: string;
  application: string;
  year: string;
  pdfUrl: string;
  city: string;
  date: string;
  name?: string;
}

const UploadExcel: React.FC = () => {
  const [jsonData, setJsonData] = useState<LectureData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        const json: LectureData[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as Partial<LectureData>);

          return {
            drn: rowData.drn || "",
            day: rowData.day || "",
            month: rowData.month || "",
            year: rowData.year || "",
            application: rowData.application || "",
            pdfUrl: rowData.pdfUrl || "",
            city: rowData.city || "",
            date: rowData.date || "",
            name: rowData.name || "",
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

  const rows = useMemo(() => {
    return jsonData?.map((json, index) => ({ ...json, id: index + 1 })) || [];
  }, [jsonData]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 50 },
    { field: "drn", headerName: "DRN", width: 150 },
    { field: "day", headerName: "Day", width: 100 },
    { field: "month", headerName: "Month", width: 100 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "application", headerName: "Application", width: 150 },
    { field: "pdfUrl", headerName: "PDF URL", width: 200 },
    { field: "city", headerName: "City", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
  ];

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Box
          {...getRootProps()}
          sx={{
            border: "1px dashed #1976d2",
            cursor: "pointer",
            flexGrow: 1,
            alignContent: "center",
            p: { xs: 2, md: 1 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadRounded sx={{ mr: 1 }} />
          <Typography variant="body1">
            Drag & drop an Excel file here, or click to select a file
          </Typography>
        </Box>

        <Button
          startIcon={<CloudUploadRounded />}
          fullWidth
          variant="contained"
          disabled={!jsonData}
        >
          Upload
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <DataGrid columns={columns} rows={rows} loading={isLoading} />
      </Box>
    </Box>
  );
};

export default UploadExcel;
