import React, { useEffect, useMemo, useState } from "react";
import { useGlobalProvider } from "../../GlobalProvider";
import YouTubeVideoPlayer from "../../components/YouTubeVideoPlayer";
import { EditRounded, DeleteRounded, UploadRounded } from "@mui/icons-material";
import { getAllAcademicData } from "../../api/academic";

import { IconButton, Box, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { CustomModal } from "../../components/CustomModal";
import CustomDropDown from "../../components/CustomDropDown";
import Swal from "sweetalert2";
import { deleteLecture, getLecturesByClass } from "../../api/lectures";
import { useDispatch } from "react-redux";
import UploadLectureSingle from "./components/UploadLectureSingle";
import UploadLectureBulk from "./components/UploadLectureBulk";

export default function LecturePage() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [lectures, setLectures] = useState([]);
  const [currVID, setCurrVID] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subSubjects, setSubSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subTopics, setSubTopics] = useState([]);

  const [showAddLecturePopup, setShowAddLecturePopup] = useState(false);
  const [showBulkUploadLecture, setShowBulkUploadLecture] = useState(false);

  const getAcademicData = async () => {
    try {
      const response = await getAllAcademicData();

      if (isValidResponse(response)) {
        const data = response.data;
        setClasses(data?.classes);
        setSubjects(data?.subjects);
        setSubSubjects(data?.subSubjects);
        setTopics(data?.topics);
        setSubTopics(data?.subTopics);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLectures = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getLecturesByClass({ className: selectedClass });
      setLectures(response.data.lectures);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getAcademicData();
    getLectures();
  }, [selectedClass]);

  const handleEditLecture = () => {};

  const handleDeleteLecture = async (lecture) => {
    const result = await Swal.fire({
      title: "Delete Lecture?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteLecture({ id: lecture?._id });
        console.log(response);

        if (isValidResponse(response)) {
          // Properly filter out the deleted lecture
          const deletedLectureId = response?.data?.deletedLecture;
          setLectures((prevLectures) =>
            prevLectures.filter((l) => l._id !== deletedLectureId)
          );

          await Swal.fire({
            title: "Deleted!",
            text: "Lecture has been deleted.",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("Error deleting lecture:", error);
        Swal.fire({
          title: "Error",
          text: "Something went wrong while deleting the lecture.",
          icon: "error",
        });
      }
    }
  };

  const columns = [
    { field: "id", headerName: "SN", width: 40 },
    {
      field: "classLevel",
      headerName: "Class",
      minWidth: 40,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "subject",
      headerName: "Subject",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "chapterName",
      headerName: "Chapter Name",
      minWidth: 300,
      flex: 1,
    },
    {
      field: "lectureNumber",
      headerName: "Lecture #",
      minWidth: 40,
      flex: 1,
    },
    {
      field: "facultyName",
      headerName: "Faculty Name",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "videoId",
      headerName: "#",
      minWidth: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setCurrVID(params.row.videoId);
              setShowVideoPopup(true);
            }}
          >
            {params.row.videoId}
          </Button>
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Box>
            <IconButton onClick={() => handleEditLecture(params.row)}>
              <EditRounded />
            </IconButton>
            <IconButton onClick={() => handleDeleteLecture(params.row)}>
              <DeleteRounded />
            </IconButton>
          </Box>
        </>
      ),
    },
  ];

  const rows = useMemo(() => {
    return lectures?.map((l, index) => ({ id: index + 1, ...l }));
  }, [lectures]);

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, lg: 3, md: 6 }}>
            <CustomDropDown
              data={classes}
              label="Class"
              name="name"
              value={selectedClass}
              dropdownValue="value"
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, lg: 3, md: 6 }}>
            <Button
              onClick={() => setShowBulkUploadLecture(true)}
              variant="contained"
              startIcon={<UploadRounded />}
            >
              Bulk Upload
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginTop: 2 }} component={Paper}>
        <DataGrid
          columns={columns}
          rows={rows}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 30, 50]}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onAddButtonClick={() => setShowAddLecturePopup(true)}
                showRefreshButton={true}
                onRefreshButtonClick={getLectures}
              />
            ),
          }}
        />
      </Box>
      {/* Add Lectures */}
      <CustomModal
        open={showAddLecturePopup}
        onClose={() => setShowAddLecturePopup(false)}
        height="auto"
        width="450px"
        header="Add Lectures"
        showFullScreenButton={false}
      >
        <UploadLectureSingle
          setShowAddLecturePopup={setShowAddLecturePopup}
          classes={classes}
          subjects={subjects}
          subSubjects={subSubjects}
          topics={topics}
          subTopics={subTopics}
        />
      </CustomModal>

      {/* Bulk Upload Lectures */}
      <CustomModal
        header="Upload Lectures"
        open={showBulkUploadLecture}
        onClose={() => setShowBulkUploadLecture(false)}
      >
        <UploadLectureBulk
          setShowBulkUploadLecture={setShowBulkUploadLecture}
        />
      </CustomModal>

      {/* Video as popup */}
      <CustomModal
        open={showVideoPopup}
        onClose={() => setShowVideoPopup(false)}
        height="auto"
        width="460px"
        header=""
        showFullScreenButton={false}
        showHeader={false}
      >
        <YouTubeVideoPlayer videoId={currVID} />
      </CustomModal>
    </>
  );
}
