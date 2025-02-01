import React, { useMemo, useState } from "react";
import FileDropZone from "../../../../components/FileDropZone";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { CloudUploadRounded, DownloadRounded } from "@mui/icons-material";
import axios from "../../../../hooks/AxiosInterceptor";

interface DataProps {
  year: number; // Exam year, e.g., 2024
  percentile: number; // Percentile corresponding to the marks (e.g., 99.5)
  marks: number;
  generalRank: number; // General category rank
  generalPwDRank: number; // General PwD category rank

  obcRank: number; // OBC category rank
  obcPwDRank: number; // OBC PwD category rank

  scRank: number; // SC category rank
  scPwDRank: number; // SC PwD category rank

  stRank: number; // ST category rank
  stPwDRank: number; // ST PwD category rank

  ewsRank: number; // EWS category rank
  ewsPwDRank: number; // EWS PwD category rank
}

interface UploadPercentilevsRankProps {
  onClose: () => void;
}

const UploadJEEAdvancedMarksVsRank: React.FC<UploadPercentilevsRankProps> = ({
  onClose,
}) => {
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
        const json: DataProps[] = dataRows.map((row) => {
          const rowData = headers.reduce((acc, header, colIndex) => {
            acc[header] = row[colIndex] || "";
            return acc;
          }, {} as Partial<DataProps>);

          return {
            year: rowData.year,
            percentile: rowData.percentile,
            marks: rowData.marks,
            // Ranks for different categories
            generalRank: rowData.generalRank,
            generalPwDRank: rowData.generalPwDRank,

            obcRank: rowData.obcRank,
            obcPwDRank: rowData.obcPwDRank,

            scRank: rowData.scRank,
            scPwDRank: rowData.scPwDRank,

            stRank: rowData.stRank,
            stPwDRank: rowData.stPwDRank,

            ewsRank: rowData.ewsRank,
            ewsPwDRank: rowData.ewsPwDRank,
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
      await axios.post("/analysis/jeeadvanced-marks-vs-rank", {
        data: JSON.stringify(jsonData),
        mode: "multiple",
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "year",
      headerName: "Year",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 120,
    },
    {
      field: "generalRank",
      headerName: "General Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "generalPwDRank",
      headerName: "General PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "obcRank",
      headerName: "OBC Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "obcPwDRank",
      headerName: "OBC PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "scRank",
      headerName: "SC Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "scPwDRank",
      headerName: "SC PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "stRank",
      headerName: "ST Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "stPwDRank",
      headerName: "ST PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "ewsRank",
      headerName: "EWS Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "ewsPwDRank",
      headerName: "EWS PwD Rank",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
  ];

  const rows = useMemo(() => {
    if (!jsonData) return;
    return jsonData.map((data, index) => ({ ...data, id: index + 1 }));
  }, [jsonData]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap" }}
      >
        <FileDropZone acceptedExtensions={[".xlsx", "xls"]} onDrop={onDrop} />
        <Button
          component="a"
          download
          href="/jee_advanced_marks_vs_rank.xlsx"
          startIcon={<DownloadRounded />}
          variant="contained"
        >
          Download Format
        </Button>
        <Button
          color="success"
          onClick={handleUploadData}
          startIcon={<CloudUploadRounded />}
          variant="contained"
        >
          Upload
        </Button>
      </Box>

      <Box>
        <DataGrid rows={rows} columns={columns} loading={isLoading} />
      </Box>
    </Box>
  );
};

export default UploadJEEAdvancedMarksVsRank;
