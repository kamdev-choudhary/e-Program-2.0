import {
  Box,
  Button,
  IconButton,
  Paper,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import FileDropZone from "../../components/FileDropZone";
import CustomDropDown from "../../components/CustomDropDown";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExcelJs from "exceljs";
import {
  DownloadRounded,
  SettingsApplicationsRounded,
} from "@mui/icons-material";

interface DataProps {
  id: Number;
  name: string;
  uniqueId: string;
  physics?: string;
  chemistry?: string;
  maths?: string;
  total?: string;
  status?: string;
}

const years = [{ name: "2024", value: "2024" }];

const JEEAdvancedAnalysis: React.FC = () => {
  const [weightage, setWieghtage] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [jsonData, setJsonData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const workbook = new ExcelJs.Workbook();
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
          const rowData = headers.reduce((acc, header, index) => {
            acc[header] = row[index] || "";
            return acc;
          }, {} as Partial<DataProps>);

          return {
            id: index + 1,
            name: rowData.name,
            uniqueId: rowData.uc || rowData.drn,
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "uniqueId",
      headerName: "Unique ID",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "physics",
      headerName: "Physics",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "chemistry",
      headerName: "Chemistry",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "maths",
      headerName: "Maths",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const rows = useMemo(() => {
    return jsonData;
  }, [jsonData]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx"]} />
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              color="success"
              sx={{ border: "1px solid rgba(0,0,0,0.2)" }}
              component="a" // Use the `a` tag as the root element
              href="/marksheet.xlsx" // Link to the file in the public folder
              download // Ensure the file is downloaded
            >
              <DownloadRounded />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <CustomDropDown
              value={selectedYear}
              onChange={(e: SelectChangeEvent) =>
                setSelectedYear(e.target.value)
              }
              label="Select Year"
              data={years}
              name="name"
              dropdownValue="value"
            />
          </Box>
          <TextField
            value={weightage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWieghtage(e.target.value)
            }
            label="Weightage"
          />
          <Button
            startIcon={<SettingsApplicationsRounded />}
            variant="contained"
            sx={{ flexWrap: "none" }}
            disabled={!selectedYear}
          >
            Generate Prediction
          </Button>
          <Button
            startIcon={<DownloadRounded />}
            variant="contained"
            sx={{ flexWrap: "none" }}
          >
            Download Analysis
          </Button>
        </Box>
      </Paper>
      <DataGrid columns={columns} rows={rows} loading={isLoading} />
    </Box>
  );
};

export default JEEAdvancedAnalysis;
