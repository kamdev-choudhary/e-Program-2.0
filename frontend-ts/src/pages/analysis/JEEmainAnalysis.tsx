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
  category: string;
  pwd: string;
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

  // const getInitialData = async () => {
  //   try {
  //     const response = await axios.get("/analysis/jeemain");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const calculatePrediction = async (data: DataProps) => {
    if (!selectedSession || !selectedYear) {
      console.error("Session or year is not selected.");
      return;
    }
    try {
      const response = await axios.get("/analysis/jeemainrank", {
        params: {
          year: selectedYear,
          session: selectedSession,
          mark: 110, // You can make this dynamic if needed
          scholarData: data,
        },
      });
      console.log("Prediction response:", response.data);
    } catch (error) {
      console.error("Error in calculatePrediction:", error);
    }
  };

  const handleReadyForPrediction = async () => {
    if (!jsonData) {
      console.error("No JSON data available for prediction.");
      return;
    }
    try {
      await Promise.all(
        jsonData.map((data) => calculatePrediction(data)) // No `await` here; return the promise
      );
      console.log("All predictions processed successfully.");
    } catch (error) {
      console.error("Error during batch prediction:", error);
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
            category: rowData.category,
            pwd: rowData.pwd,
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
      field: "category",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pwd",
      headerName: "PWD",
      align: "center",
      headerAlign: "center",
    },

    {
      field: "physics_positive",
      headerName: "Physics +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "physics_negative",
      headerName: "Physics -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "physics",
      headerName: "Physics ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry_positive",
      headerName: "chemistry +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry_negative",
      headerName: "chemistry -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry",
      headerName: "chemistry ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths_positive",
      headerName: "maths +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths_negative",
      headerName: "maths -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths",
      headerName: "maths ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_positive",
      headerName: "total +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_negative",
      headerName: "total -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "total ",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "percentile",
      headerName: "Percentile",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rank",
      headerName: "Rank",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
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
            <Button onClick={handleReadyForPrediction}>Calculate</Button>
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
