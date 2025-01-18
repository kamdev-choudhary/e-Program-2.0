import { CloudUploadRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as ExcelJS from "exceljs";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";

interface LectureData {
  className: string;
  subject: string;
  chapter: string;
  topic: string;
  lectureNumber: string;
  link: string;
}

interface UploadExcelProps {
  setShowExcelUpload: (value: boolean) => void;
  setLectures: (value: any) => void;
}

const UploadExcel: React.FC<UploadExcelProps> = ({
  setShowExcelUpload,
  setLectures,
}) => {
  const { isValidResponse } = useGlobalContext();
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
            className: rowData.className || "",
            subject: rowData.subject || "",
            chapter: rowData.chapter || "",
            topic: rowData.topic || "",
            lectureNumber: rowData.lectureNumber || "",
            link: rowData.link || "",
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
    if (!jsonData) return [];
    return jsonData.map((d, index) => ({ ...d, id: index + 1 }));
  }, [jsonData]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 50 },
    { field: "className", headerName: "Class", width: 150, flex: 1 },
    { field: "chapter", headerName: "Chapter Name", width: 100, flex: 1 },
    { field: "topic", headerName: "Topic Name", width: 100, flex: 1 },
    { field: "lectureNumber", headerName: "Lecture #", width: 100, flex: 1 },
    { field: "link", headerName: "Application", width: 150, flex: 1 },
  ];

  const handleUploadLectures = async () => {
    try {
      const response = await axios.post("/lectures/upload", {
        data: JSON.stringify(jsonData),
        linkType: "youtube",
      });
      if (isValidResponse(response)) {
        setShowExcelUpload(false);
        setLectures(response.data.insertedRecords);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          onClick={handleUploadLectures}
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
