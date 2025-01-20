import React, { useState } from "react";
import FileDropZone from "../../../../components/FileDropZone";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { CloudUploadRounded } from "@mui/icons-material";
import axios from "../../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../../contexts/GlobalProvider";

interface DataProps {
  _id?: string; // Optional field for MongoDB document ID
  examYear: number; // Exam year, e.g., 2024
  examSession: string; // Session, e.g., "January", "April"
  marks: number; // Specific marks (e.g., 200)
  percentile: number; // Percentile corresponding to the marks (e.g., 99.5)
  rank: number; // Overall rank for the specific marks
  generalRank: number; // Rank for General category
  obcRank?: number; // Rank for OBC category (optional)
  scRank?: number; // Rank for SC category (optional)
  stRank?: number; // Rank for ST category (optional)
  ewsRank?: number; // Rank for EWS category (optional)
  pwdRank?: number; // Rank for PwD category (optional)
}

interface UploadJeeMainMarksVsRankProps {
  onClose: () => void;
}

const UploadJeeMainMarksVsRank: React.FC<UploadJeeMainMarksVsRankProps> = ({
  onClose,
}) => {
  const { isValidResponse } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<DataProps[]>([]);

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
        const json: DataProps[] = dataRows.map((row, index) => {
          const rowData = headers.reduce((acc, header, colIndex) => {
            acc[header] = row[colIndex] || "";
            return acc;
          }, {} as Partial<DataProps>);
          return {
            id: index + 1, // Add an ID field for the DataGrid
            examYear: rowData.examYear,
            examSession: rowData.examSession,
            marks: rowData.marks,
            percentile: rowData.percentile,
            rank: rowData.rank,
            generalRank: rowData.generalRank,
            obcRank: rowData.obcRank,
            scRank: rowData.scRank,
            stRank: rowData.stRank,
            ewsRank: rowData.ewsRank,
            pwdRank: rowData.pwdRank,
          } as DataProps;
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

  const handleUploadData = async () => {
    try {
      const response = await axios.post("/analysis/jeemainmarksvsrank", {
        data: JSON.stringify(jsonData),
        mode: "multiple",
      });
      if (isValidResponse(response)) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 70 },
    { field: "examYear", headerName: "Exam Year", flex: 1, align: "center" },
    { field: "examSession", headerName: "Session", flex: 1, align: "center" },
    { field: "marks", headerName: "Marks", flex: 1, align: "center" },
    { field: "percentile", headerName: "Percentile", flex: 1, align: "center" },
    { field: "rank", headerName: "Overall Rank", flex: 1, align: "center" },
    {
      field: "generalRank",
      headerName: "General Rank",
      flex: 1,
      align: "center",
    },
    { field: "obcRank", headerName: "OBC Rank", flex: 1, align: "center" },
    { field: "scRank", headerName: "SC Rank", flex: 1, align: "center" },
    { field: "stRank", headerName: "ST Rank", flex: 1, align: "center" },
    { field: "ewsRank", headerName: "EWS Rank", flex: 1, align: "center" },
    { field: "pwdRank", headerName: "PwD Rank", flex: 1, align: "center" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <FileDropZone acceptedExtensions={[".xlsx", "xls"]} onDrop={onDrop} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={handleUploadData}
          startIcon={<CloudUploadRounded />}
          variant="contained"
        >
          Upload
        </Button>
      </Box>
      <Box height={400}>
        <DataGrid rows={jsonData} columns={columns} loading={isLoading} />
      </Box>
    </Box>
  );
};

export default UploadJeeMainMarksVsRank;
