import React, { useEffect, useMemo, useState } from "react";
import ExcelJs from "exceljs";
import { Box, SelectChangeEvent, Paper, Grid2 as Grid } from "@mui/material";

import FileDropZone from "../../components/FileDropZone";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomDropDown from "../../components/CustomDropDown";
import axios from "../../hooks/AxiosInterceptor";

interface DataProps {
  id: number | string;
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
  percentile?: number;
  rank?: number;
}

interface YearsProps {
  name: string;
  value: string;
}

interface SessionProps {
  year: number;
  session: string;
}

interface SessionWithDatesProps {
  year: number;
  session: string;
  date: string;
}

interface SessionDateWithShiftsProps {
  year: number;
  session: string;
  date: string;
  shift: string;
}

const JEEmainAnalysis: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<YearsProps[] | null>(null);
  const [session, setSession] = useState<SessionProps[] | null>(null);
  const [sessionWithDates, setSessionWithDates] = useState<
    SessionWithDatesProps[] | null
  >(null);
  const [sessionDatesWithShift, setSessionDatesWithShift] = useState<
    SessionDateWithShiftsProps[] | null
  >(null);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("");

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const res = await axios.get(
          "/analysis/jeemain-marks-vs-percentile/metadata"
        );
        console.log(res);
        setYears(res.data.years);
        setSession(res.data.sessions);
        setSessionWithDates(res.data.sessionDates);
        setSessionDatesWithShift(res.data.sessionDateShifts);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    };
    getInitialData();
  }, []);

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
    if (!jsonData || jsonData.length === 0) {
      console.error("No JSON data available for prediction.");
      return;
    }
    try {
      await Promise.all(jsonData.map((data) => calculatePrediction(data)));
      console.log("All predictions processed successfully.");
    } catch (error) {
      console.error("Error during batch prediction:", error);
    }
  };

  console.log(handleReadyForPrediction);

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
          // Remove the first element which is often empty
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
          const rowData = header.reduce((acc, headerKey, index) => {
            if (typeof headerKey === "string") {
              acc[headerKey] = row[index] || "";
            }
            return acc;
          }, {} as Partial<DataProps>);

          return {
            id: rowIndex + 1,
            drn: rowData.drn as string,
            name: rowData.name as string,
            category: rowData.category as string,
            pwd: rowData.pwd as string,
            physics_positive: Number(rowData.physics_positive),
            physics_negative: Number(rowData.physics_negative),
            physics: Number(rowData.physics),
            chemistry_positive: Number(rowData.chemistry_positive),
            chemistry_negative: Number(rowData.chemistry_negative),
            chemistry: Number(rowData.chemistry),
            maths_positive: Number(rowData.maths_positive),
            maths_negative: Number(rowData.maths_negative),
            maths: Number(rowData.maths),
            total_positive:
              Number(rowData.physics_positive) +
              Number(rowData.chemistry_positive) +
              Number(rowData.maths_positive),
            total_negative:
              Number(rowData.physics_negative) +
              Number(rowData.chemistry_negative) +
              Number(rowData.maths_negative),
            total:
              Number(rowData.physics) +
              Number(rowData.chemistry) +
              Number(rowData.maths),
            percentile: 0,
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
    { field: "id", headerName: "SN", width: 80 },
    { field: "drn", headerName: "DRN", flex: 1, minWidth: 120 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    {
      field: "category",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "pwd",
      headerName: "PWD",
      align: "center",
      headerAlign: "center",
      width: 120,
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
      headerName: "Physics",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry_positive",
      headerName: "Chemistry +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry_negative",
      headerName: "Chemistry -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chemistry",
      headerName: "Chemistry",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths_positive",
      headerName: "Maths +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths_negative",
      headerName: "Maths -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maths",
      headerName: "Maths",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_positive",
      headerName: "Total +ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_negative",
      headerName: "Total -ve",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "Total",
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

  // Filter sessions based on selected year
  const filteredSession = useMemo(() => {
    if (!session) return [];
    return session.filter(
      (ses) => !selectedYear || ses.year === Number(selectedYear)
    );
  }, [session, selectedYear]);

  const filteredDate = useMemo(() => {
    if (!sessionWithDates) return [];
    return sessionWithDates.filter((date) => date.session === selectedSession);
  }, [sessionWithDates, selectedSession]);

  const filteredShift = useMemo(() => {
    if (!sessionDatesWithShift) return [];
    return sessionDatesWithShift.filter((shift) => shift.date === selectedDate);
  }, [sessionDatesWithShift, selectedDate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <Paper sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <Box>
          <FileDropZone
            onDrop={onDrop}
            acceptedExtensions={[".xlsx", ".xls"]}
          />
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <CustomDropDown
                data={years || []}
                value={selectedYear}
                label="Year"
                onChange={(e: SelectChangeEvent) => {
                  setSelectedYear(e.target.value);
                  setSelectedSession("");
                  setSelectedDate("");
                  setSelectedShift("");
                }}
                name="name"
                dropdownValue="value"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <CustomDropDown
                data={filteredSession}
                value={selectedSession}
                label="Session"
                onChange={(e: SelectChangeEvent) => {
                  setSelectedSession(e.target.value);
                  setSelectedDate("");
                  setSelectedShift("");
                }}
                name="session"
                dropdownValue="session"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <CustomDropDown
                data={filteredDate}
                value={selectedDate}
                label="Date"
                onChange={(e: SelectChangeEvent) => {
                  setSelectedDate(e.target.value);
                  setSelectedShift("");
                }}
                name="date"
                dropdownValue="date"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <CustomDropDown
                data={filteredShift}
                value={selectedShift}
                label="Shift"
                onChange={(e: SelectChangeEvent) =>
                  setSelectedShift(e.target.value)
                }
                name="shift"
                dropdownValue="shift"
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Box sx={{ height: 600 }}>
        <DataGrid
          loading={isLoading}
          rows={jsonData}
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
