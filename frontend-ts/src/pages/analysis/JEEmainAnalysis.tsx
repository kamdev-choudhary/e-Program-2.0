import React, { useState } from "react";
import ExcelJs from "exceljs";
import { Box, SelectChangeEvent, Grid2 as Grid, Button } from "@mui/material";
import FileDropZone from "../../components/FileDropZone";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomDropDown from "../../components/CustomDropDown";
import axios from "../../hooks/AxiosInterceptor";

interface DataProps {
  drn: string;
  name: string;
  physics_positive: number;
  physics_negative: number;
  physics: number;
  chemistry_positive: number;
  chemistry_negative: number;
  chemistry: number;
  maths_positive: number;
  maths_negative: number;
  maths: number;
  total_positive?: number;
  total_negative?: number;
  total?: number;
  percetile?: number;
  rank?: number;
}

const JEEmainAnalysis: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");

  const calculatePridication = async () => {
    if (!selectedSession || !selectedYear) return;
    try {
      const response = await axios.get("/analysis/jeemainrank", {
        params: {
          year: selectedYear,
          session: selectedSession,
          mark: 110,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsLoading(true);

    const file = acceptedFiles[0];
    const reader = new FileReader();
    const workbook = new ExcelJs.Workbook();

    reader.onload = async (e) => {
      const buffer = e.target?.result;
      if (!(buffer instanceof ArrayBuffer)) {
        setIsLoading(false);
        console.error("File reader error");
        return;
      }
      try {
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        const rows: Array<any[]> = [];
        worksheet.eachRow((row) => {
          const rowValue = Array.isArray(row.values) ? row.values.slice(1) : [];
          rows.push(rowValue);
        });

        if (rows.length === 0) {
          console.error("No rows found in the Excel file.");
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const [header, ...dataRows] = rows;

        if (!header || header.length === 0) {
          console.error("No valid headers found in the file.");
          setJsonData([]);
          setIsLoading(false);
          return;
        }

        const json: DataProps[] = dataRows.map((row, rowIndex) => {
          const rowData = header.reduce((acc, header, index) => {
            if (typeof header === "string") {
              acc[header] = row[index] || "";
            }
            return acc;
          }, {} as Partial<DataProps>);
          return {
            id: rowIndex + 1 || "",
            drn: rowData.drn,
            name: rowData.name,
            physics_positive: rowData.physics_postive,
            physics_negative: rowData.physics_positive,
            physics: rowData.physics,
            chemistry_positive: rowData.chemistry_positive,
            chemistry_negative: rowData.chemistry_negative,
            chemistry: rowData.chemistry,
            maths_positive: rowData.maths_positive,
            maths_negative: rowData.maths_negative,
            maths: rowData.maths,
            total_positive:
              +rowData.physics_positive +
              +rowData.chemistry_positive +
              +rowData.maths_positive,
            total_negative:
              +rowData.physics_negative +
              +rowData.chemistry_negative +
              +rowData.maths_negative,
            total: +rowData.physics + +rowData.chemistry + +rowData.maths,
            percetile: 0,
            rank: 0,
          };
        });

        setJsonData(json);
      } catch (error) {
        console.error("Error reading Excel file:", error);
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
    },
    {
      field: "drn",
      headerName: "DRN",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "physics_positive",
      headerName: "Physics +ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "physics_negative",
      headerName: "Physics -ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "physics",
      headerName: "Physics ",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "chemistry_positive",
      headerName: "chemistry +ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "chemistry_negative",
      headerName: "chemistry -ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "chemistry",
      headerName: "chemistry ",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "maths_positive",
      headerName: "maths +ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "maths_negative",
      headerName: "maths -ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "maths",
      headerName: "maths ",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "total_positive",
      headerName: "total +ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "total_negative",
      headerName: "total -ve",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "total",
      headerName: "total ",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "percentile",
      headerName: "Percentile",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "rank",
      headerName: "Rank",
      flex: 1,
      minWidth: 120,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <FileDropZone onDrop={onDrop} acceptedExtensions={[".xlsx", ".xls"]} />
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              label="Year"
              value={selectedYear}
              data={[{ name: 2024, value: 2024 }]}
              onChange={(e: SelectChangeEvent) =>
                setSelectedYear(e.target.value)
              }
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              label="Session"
              value={selectedSession}
              data={[{ name: "January", value: "January (01)" }]}
              onChange={(e: SelectChangeEvent) =>
                setSelectedSession(e.target.value)
              }
              name="name"
              dropdownValue="value"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Button onClick={calculatePridication}>Calculate</Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <DataGrid
          loading={isLoading}
          rows={jsonData || []}
          columns={columns}
          initialState={{
            columns: {
              columnVisibilityModel: {
                physics_positive: false,
                physics_negative: false,
                chemistry_positive: false,
                chemistry_negative: false,
                maths_positive: false,
                maths_negative: false,
                total_positive: false,
                total_negative: false,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default JEEmainAnalysis;
