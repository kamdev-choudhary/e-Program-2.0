import { CloudUploadRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as ExcelJS from "exceljs";
import React, { useMemo, useState } from "react";
import FileDropZone from "../../../components/FileDropZone";
import axios from "../../../hooks/AxiosInterceptor";

interface Lecture {
  _id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  link: string;
  linkType: string;
  facultyName: string;
  lectureNumber: string;
}

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
  lectures: Lecture[] | null;
}

const UploadExcel: React.FC<UploadExcelProps> = ({
  setShowExcelUpload,
  setLectures,
  lectures,
}) => {
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
      const response = await axios.post("/lectures", {
        data: JSON.stringify(jsonData),
        linkType: "youtube",
        mode: "multiple",
      });
      setShowExcelUpload(false);
      setLectures([lectures, response.data.insertedRecords]);
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
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <FileDropZone
            onDrop={onDrop}
            acceptedExtensions={[".xlsx", ".xls"]}
          />
          <Button
            startIcon={<CloudUploadRounded />}
            variant="contained"
            disabled={!jsonData}
            onClick={handleUploadLectures}
          >
            Upload
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <DataGrid columns={columns} rows={rows} loading={isLoading} />
      </Box>
    </Box>
  );
};

export default UploadExcel;
