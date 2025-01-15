import { Typography, Box, Divider, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";
import { DataArrayRounded, UploadFileRounded } from "@mui/icons-material";
import { CustomModal } from "../../../components/CustomModal";
import UploadExcel from "./UploadExcel";
import UploadVideo from "./UploadVideo";

interface Lecture {
  _id: string;
  title: string;
}

const Lectures: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showExcelUpload, setShowExcelUpload] = useState<boolean>(false);
  const [showVideoUpload, setShowVideoUpload] = useState<boolean>(false);

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
    { field: "title", headerName: "Lecture Title", flex: 1 },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4">Lectures</Typography>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            gap: 2,
            width: { sm: "100%" },
            maxWidth: 350,
          }}
        >
          <Button
            sx={{ flexGrow: 1 }}
            startIcon={<DataArrayRounded />}
            onClick={() => setShowExcelUpload(true)}
            variant="contained"
          >
            Upload Excel
          </Button>
          <Button
            variant="contained"
            sx={{ flexGrow: 1 }}
            startIcon={<UploadFileRounded />}
            onClick={() => setShowVideoUpload(true)}
          >
            Upload Lecture
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 400 }}>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={loading}
          initialState={{ pagination: { paginationModel: { page: 10 } } }}
          pageSizeOptions={[10, 30, 50]}
        />
      </Box>

      {/* Upload Excel File */}
      <CustomModal
        open={showExcelUpload}
        onClose={() => setShowExcelUpload(false)}
        header="Upload Excel"
        height="95svh"
        width="90vw"
        autoClose={false}
      >
        <UploadExcel />
      </CustomModal>

      {/* Upload Video */}
      <CustomModal
        open={showVideoUpload}
        onClose={() => setShowVideoUpload(false)}
        header="Upload Video"
        height="95svh"
        width="90vw"
        autoClose={false}
      >
        <UploadVideo />
      </CustomModal>
    </Box>
  );
};

export default Lectures;
