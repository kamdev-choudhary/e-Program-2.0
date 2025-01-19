import React, { useEffect, useState } from "react";
import { Typography, Box, Divider, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import axios from "../../hooks/AxiosInterceptor";
import { YouTube } from "@mui/icons-material";
import { CustomModal } from "../../components/CustomModal";
import YouTubeVideoPlayer from "../../components/YoutubePlayer";
import { useGlobalContext } from "../../contexts/GlobalProvider";

interface Lecture {
  _id: string;
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  link: string;
  linkType: string;
  facultyName: string;
  lectureNumber: string;
}

const Lectures: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalLectures, setTotalLectures] = useState<number>(0); // Total count from backend
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showYoutubePlayer, setShowYoutubePlayer] = useState<boolean>(false);

  // Fetch lectures from backend
  const fetchLectures = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/lectures`, {
        params: {
          page: page + 1, // Backend might use 1-based indexing
          limit: pageSize,
        },
      });

      if (isValidResponse(response)) {
        setLectures(response.data.lectures);
        setTotalLectures(response.data.totalCount || 0); // Ensure backend sends total count
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever pagination changes
  useEffect(() => {
    const { page, pageSize } = paginationModel;
    fetchLectures(page, pageSize);
  }, [paginationModel]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Lecture Title",
      flex: 1,
      minWidth: 120,
      editable: false,
    },
    {
      field: "className",
      headerName: "Class",
      flex: 1,
      minWidth: 50,
      editable: false,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 80,
      editable: false,
    },
    {
      field: "chapter",
      headerName: "Chapter",
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: "topic",
      headerName: "Topic",
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: "lectureNumber",
      headerName: "Lecture #",
      flex: 1,
      minWidth: 50,
      editable: false,
    },
    {
      field: "facultyName",
      headerName: "Faculty Name",
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: "Actions",
      headerName: "Play",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => {
              setSelectedLecture(params.row);
              setShowYoutubePlayer(true);
            }}
          >
            <YouTube sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
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
      </Box>
      <Divider sx={{ mb: 2 }} />
      <DataGrid
        columns={columns}
        rows={lectures.map((lecture, index) => ({
          id: index + 1 + paginationModel.page * paginationModel.pageSize, // Calculate row index
          ...lecture,
        }))}
        loading={loading}
        paginationModel={paginationModel} // Controlled pagination
        onPaginationModelChange={(newModel) => setPaginationModel(newModel)} // Handle page changes
        pageSizeOptions={[10, 20, 50]} // Options for page size
        rowCount={totalLectures} // Total count from backend
        paginationMode="server" // Server-side pagination
        disableRowSelectionOnClick
        disableColumnMenu
      />

      <CustomModal
        open={showYoutubePlayer}
        onClose={() => {
          setShowYoutubePlayer(false);
          setSelectedLecture(null);
        }}
        showHeader={false}
        height="auto"
      >
        <YouTubeVideoPlayer url={selectedLecture?.link || ""} />
      </CustomModal>
    </Box>
  );
};

export default Lectures;
