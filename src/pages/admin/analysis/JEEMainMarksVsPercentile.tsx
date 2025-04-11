import { Box, Grid2 as Grid, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { CustomToolbar } from "../../../components/CustomToolbar";
import { CustomModal } from "../../../components/CustomModal";
import UploadJeeMainMarksVsRank from "./part/MarksVsPercentileUploadService";
import CustomDropDown from "../../../components/CustomDropDown";
import axios from "../../../hooks/AxiosInterceptor";
import moment from "moment";

interface JEEMainMarksVsRankProps {
  _id?: string;
  year: number;
  session: string;
  date: string;
  marks: number;
  percentile: number;
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

const JEEMainMarksVsPercentile: React.FC = () => {
  const [data, setData] = useState<JEEMainMarksVsRankProps[]>([]);
  const [showUploadData, setShowUploadData] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        setSession(res.data.sessions);
        setSessionWithDates(res.data.sessionDates);
        setSessionDatesWithShift(res.data.sessionDateShifts);
      } catch (error) {
        console.error(error);
      }
    };
    getInitialData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "/analysis/jeemain-marks-vs-percentile",
        {
          params: {
            year: selectedYear || undefined,
            session: selectedSession || undefined,
            shift: selectedShift || undefined,
            date: selectedDate || undefined,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedYear) return;
    fetchData();
  }, [selectedYear, selectedSession, selectedDate, selectedShift]);

  const handleProcessRowUpdate = async (
    newRow: JEEMainMarksVsRankProps,
    oldRow: JEEMainMarksVsRankProps
  ): Promise<JEEMainMarksVsRankProps> => {
    const hasChanges = Object.keys(newRow).some(
      (key) =>
        newRow[key as keyof JEEMainMarksVsRankProps] !==
        oldRow[key as keyof JEEMainMarksVsRankProps]
    );

    if (!hasChanges) {
      return oldRow;
    }
    setData((prevData) =>
      prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      )
    );

    const { _id, ...updateField } = newRow;
    try {
      await axios.patch(
        `/analysis/jeemainmarksvsrank/${oldRow._id}`,
        updateField
      );
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setData((prevData) =>
        prevData.map((item) => (item._id === oldRow._id ? oldRow : item))
      );
      throw error;
    }
  };

  const rows = useMemo(
    () => data.map((d, index) => ({ ...d, id: index + 1 })),
    [data]
  );

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
      field: "session",
      headerName: "Session",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 150,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 150,
      renderCell: (params) => (
        <>{moment(params.row.date).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      minWidth: 150,
    },
    {
      field: "marks",
      headerName: "Marks",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "percentile",
      headerName: "Percentile",
      align: "center",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
  ];

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <CustomDropDown
              data={[
                { name: 2023, value: 2023 },
                { name: 2024, value: 2024 },
              ]}
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
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: () => (
            <CustomToolbar onAdd={() => setShowUploadData(true)} />
          ),
        }}
        loading={isLoading}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 30, 50]}
        processRowUpdate={handleProcessRowUpdate}
      />
      <CustomModal
        open={showUploadData}
        onClose={() => setShowUploadData(false)}
        header="Upload JEE Main Marks Vs Rank"
      >
        <UploadJeeMainMarksVsRank onClose={() => setShowUploadData(false)} />
      </CustomModal>
    </Box>
  );
};

export default JEEMainMarksVsPercentile;
