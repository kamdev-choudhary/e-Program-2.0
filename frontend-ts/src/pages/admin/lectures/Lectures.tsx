import { Typography, Box, Divider, Button, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../contexts/GlobalProvider";
import {
  DataArrayRounded,
  DeleteRounded,
  UploadFileRounded,
  YouTube,
} from "@mui/icons-material";
import { CustomModal } from "../../../components/CustomModal";
import UploadExcel from "./UploadExcel";
import UploadVideo from "./UploadVideo";
import YouTubeVideoPlayer from "../../../components/YoutubePlayer";
import { CustomToolbar } from "../../../components/CustomToolbar";
import AddSingleLecture from "./AddSingleLecture";
import Swal from "sweetalert2";

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
  const [lectures, setLectures] = useState<Lecture[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showExcelUpload, setShowExcelUpload] = useState<boolean>(false);
  const [showVideoUpload, setShowVideoUpload] = useState<boolean>(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showYoutubePlayer, setShowYoutubePlayer] = useState<boolean>(false);
  const [showAddSingleLecture, setShowAddSingleLecture] =
    useState<boolean>(false);

  const getLectures = async () => {
    try {
      const response = await axios.get("/lectures");
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
    if (!lectures) return [];
    return lectures.map((lecture, index) => ({
      id: index + 1, // Unique ID for DataGrid
      ...lecture,
    }));
  }, [lectures]);

  // Cell update
  const handleProcessRowUpdate = async (
    newRow: Lecture,
    oldRow: Lecture
  ): Promise<Lecture> => {
    const hasChanges = Object.keys(newRow).some(
      (key) => newRow[key as keyof Lecture] !== oldRow[key as keyof Lecture]
    );

    if (!hasChanges) {
      return oldRow;
    }
    setLectures((prevData) => {
      if (!prevData) return null;
      return prevData.map((item) =>
        item._id === oldRow._id ? { ...item, ...newRow } : item
      );
    });

    const { _id, ...updateField } = newRow;

    try {
      const response = await axios.patch(`/lectures/${oldRow._id}`, {
        lectureDataToUpdate: updateField,
      });
      if (isValidResponse(response)) {
        setLectures((prevData) => {
          if (!prevData) return null;
          return prevData.map((item) =>
            item._id === oldRow._id ? newRow : item
          );
        });
      }
      return newRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      setLectures((prevData) => {
        if (!prevData) return null;
        return prevData.map((item) =>
          item._id === oldRow._id ? oldRow : item
        );
      });

      throw error;
    }
  };

  const handleDeleteLecture = async (id: string) => {
    if (!id) return;
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(`/lectures`);
          if (isValidResponse(response)) {
            setLectures((prevLectures) => {
              return prevLectures
                ? prevLectures.filter((lecture) => lecture._id !== id)
                : null;
            });
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        }
      });
    } catch (error) {}
  };

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
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      editable: true,
    },
    {
      field: "className",
      headerName: "Class",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 50,
      editable: true,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 80,
      editable: true,
    },
    {
      field: "chapter",
      headerName: "Chapter",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "topic",
      headerName: "Topic",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "lectureNumber",
      headerName: "Lecture #",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 50,
      editable: true,
    },
    {
      field: "facultyName",
      headerName: "Faculty Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "duraction",
      headerName: "Lecture Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      editable: true,
    },
    {
      field: "linkType",
      headerName: "Subject",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      editable: true,
    },
    {
      field: "link",
      headerName: "Lecture Link",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      editable: true,
    },
    {
      field: "Actions",
      headerName: "Play",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      renderCell: (params) => (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <IconButton onClick={() => handleDeleteLecture(params.row._id)}>
              <DeleteRounded />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedLecture(params.row);
                setShowYoutubePlayer(true);
              }}
            >
              <YouTube sx={{ color: "red" }} />
            </IconButton>
          </Box>
        </>
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
      <Box>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 30, 50]}
          processRowUpdate={handleProcessRowUpdate}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => (
              <CustomToolbar
                showAddButton={true}
                showRefreshButton={true}
                onRefreshButtonClick={getLectures}
                onAddButtonClick={() => setShowAddSingleLecture(true)}
              />
            ),
          }}
          rowBufferPx={5}
          disableColumnMenu
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
        <UploadExcel
          setShowExcelUpload={setShowExcelUpload}
          setLectures={setLectures}
        />
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
      {/* Youtube Player */}
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

      {/* Add Single Lecture */}
      <CustomModal
        open={showAddSingleLecture}
        onClose={() => setShowAddSingleLecture(false)}
        height="auto"
        width="auto"
      >
        <AddSingleLecture setShowAddSingleLecture={setShowAddSingleLecture} />
      </CustomModal>
    </Box>
  );
};

export default Lectures;
