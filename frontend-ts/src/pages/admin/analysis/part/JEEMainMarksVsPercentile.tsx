import React, { useState } from "react";
import FileDropZone from "../../../../components/FileDropZone";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { CloudUploadRounded } from "@mui/icons-material";
import axios from "../../../../hooks/AxiosInterceptor";
import moment from "moment";

interface DataProps {
  year: number; // Exam year, e.g., 2024
  session: string; // Session, e.g., "January", "April"
  marks: number; // Specific marks (e.g., 200)
  shift: string;
  date: string;
  percentile: number; // Percentile corresponding to the marks (e.g., 99.5)
}

interface UploadJeeMainMarksVsPercentile {
  onClose: () => void;
}

const UploadJeeMainMarksVsPercentile: React.FC<
  UploadJeeMainMarksVsPercentile
> = ({ onClose }) => {
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
            marks: rowData.marks,
            date: rowData.date,
            year: rowData.year,
            session: rowData.session,
            shift: rowData.shift,
            percentile: rowData.percentile,
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
      await axios.post("/analysis/jeemain-marks-vs-percetile", {
        data: JSON.stringify(jsonData),
        mode: "multiple",
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 70 },
    {
      field: "year",
      headerName: "Exam Year",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "session",
      headerName: "Session",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>{moment(params.row.date).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "marks",
      headerName: "Marks",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "percentile",
      headerName: "Percentile",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <FileDropZone acceptedExtensions={[".xlsx", "xls"]} onDrop={onDrop} />{" "}
        <Button
          onClick={handleUploadData}
          startIcon={<CloudUploadRounded />}
          variant="contained"
        >
          Upload
        </Button>
      </Box>

      <Box>
        <DataGrid rows={jsonData} columns={columns} loading={isLoading} />
      </Box>
    </Box>
  );
};

export default UploadJeeMainMarksVsPercentile;
