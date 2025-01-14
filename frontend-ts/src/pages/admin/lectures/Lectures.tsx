import { Paper, Typography, Box, Divider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";

interface Lecture {
  _id: string;
  title: string;
}

const Lectures: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getLectures = async () => {
    try {
      const response = await axios.post("/lectures");
      if (isValidResponse(response)) {
        setLectures(response.data.lectures || []);
      }
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLectures();
  }, []);

  const rows = useMemo(() => {
    return lectures.map((lecture, index) => ({
      id: index + 1, // Unique ID for DataGrid
      ...lecture,
    }));
  }, [lectures]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "SN", width: 100 },
    { field: "title", headerName: "Lecture Title", flex: 1 },
  ];

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Box marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Lectures
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ height: 400 }}>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={loading}
          initialState={{ pagination: { paginationModel: { page: 10 } } }}
          pageSizeOptions={[10, 30, 50]}
        />
      </Box>
    </Paper>
  );
};

export default Lectures;
