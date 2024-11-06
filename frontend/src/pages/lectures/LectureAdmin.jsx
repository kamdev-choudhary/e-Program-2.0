import React, { useEffect, useMemo, useState } from "react";
import { useGlobalProvider } from "../../GlobalProvider";
import { API_URL } from "../../constants/helper";
import YouTubeVideoPlayer from "../../components/YouTubeVideoPlayer";
import { EditRounded, DeleteRounded } from "@mui/icons-material";

import {
  TextField,
  Modal,
  IconButton,
  Box,
  Select,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { CustomModal } from "../../components/CustomModal";
import CustomDropDown from "../../components/CustomDropDown";
import Swal from "sweetalert2";
import { getLecturesByClass } from "../../api/lectures";
import { useDispatch } from "react-redux";
import { getClasses } from "../../api/academic";

export default function LecturePage() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [lectures, setLectures] = useState([]);
  const [currVID, setCurrVID] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState("IX");
  const [classes, setClasses] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddLecturePopup, setShowAddLecturePopup] = useState(false);
  const [newLecture, setNewLecture] = useState({
    class: "",
    subject: "",
    chapterName: "",
    lectureNumber: "",
    videoId: "",
  });
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    const getClass = async () => {
      try {
        const response = await getClasses();
        if (isValidResponse(response)) {
          setClasses(response?.data?.classes);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getClass();
  }, []);

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
    getLectures();
  }, [selectedClass]);

  const handleAddNewLecture = () => {
    console.log("haha");
  };

  const handleEditLecture = () => {};

  const handleDeleteLecture = async (lecture) => {
    console.log(lecture);
    Swal.fire({
      title: "Delete Lecture?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const columns = [
    { field: "id", headerName: "SN", width: 40 },
    {
      field: "class",
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
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chapterName",
      headerName: "Chapter Name",
      minWidth: 300,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lectureNumber",
      headerName: "Lecture #",
      minWidth: 40,
      flex: 1,
      align: "center",
      headerAlign: "center",
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
        <Box sx={{ display: "grid", rowGap: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="class"
              name="class"
              label="Class"
              value={selectedClass}
              onChange={(e) =>
                setNewLecture({ ...newLecture, class: e.target.value })
              }
            >
              {academic &&
                academic.classes &&
                academic.classes.map((classes, index) => (
                  <MenuItem key={index} value={classes}>
                    {"Class : "}
                    {classes}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="subject"
              label="Subject"
              value={newLecture.subject}
              onChange={(e) =>
                setNewLecture({
                  ...newLecture,
                  subject: e.target.value,
                })
              }
            >
              {academic &&
                academic.subjects &&
                academic.subjects.map((subject, index) => (
                  <MenuItem key={index} value={subject.name}>
                    {subject.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Topic</InputLabel>
            <Select
              labelId="Topic Selection"
              id="selectTopic"
              name="chapterName"
              label="Chapter Name"
              value={newLecture.chapterName}
              onChange={(e) =>
                setNewLecture({
                  ...newLecture,
                  chapterName: e.target.value,
                })
              }
            >
              {filteredTopics &&
                filteredTopics.map((topics, index) => (
                  <MenuItem key={index} value={topics.name}>
                    {topics.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            id="outlined-basic"
            label="Lecture Number"
            fullWidth
            size="small"
            variant="outlined"
            value={newLecture.lectureNumber}
            onChange={(e) =>
              setNewLecture({
                ...newLecture,
                lectureNumber: e.target.value,
              })
            }
          />
          <TextField
            id="outlined-basic"
            label="Video ID"
            fullWidth
            size="small"
            variant="outlined"
            value={newLecture.videoId}
            onChange={(e) =>
              setNewLecture({
                ...newLecture,
                videoId: e.target.value,
              })
            }
          />
          <Button
            onClick={handleAddNewLecture}
            variant="contained"
            color="success"
            fullWidth
          >
            Save Lecture
          </Button>
        </Box>
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
