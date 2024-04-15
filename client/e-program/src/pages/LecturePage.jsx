import React, { useEffect, useState } from "react";
import YouTubeVideo from "../components/YoutubeVideo";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useAuth } from "../components/Auth";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function CollapsibleTable({ lectures, playLecture }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead className="bg bg-primary ">
          <TableRow>
            <TableCell align="center" className="text-white">
              Chapter Name
            </TableCell>
            <TableCell align="center" className="text-white">
              Lecture #
            </TableCell>
            <TableCell align="center" className="text-white">
              Video
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lectures.map((lecture, lectureIndex) => (
            <TableRow key={lectureIndex}>
              <TableCell align="center">{lecture.chapterName}</TableCell>
              <TableCell align="center">{lecture.lectureNumber}</TableCell>
              <TableCell align="center">
                <span
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => playLecture(lecture.videoId)}
                >
                  <i className="fa-brands fa-youtube"></i> &nbsp;Play
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function LecturePage() {
  const { isAdmin, isLoggedIn, userId } = useAuth();

  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);
  const [collapsedChapter, setCollapsedChapter] = useState(null);
  const [currVID, setCurrVID] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState("IX");
  const [academic, setAcademic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddLecturePopup, setShowAddLecturePopup] = useState(false);

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [isLoading]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_URL}/auth/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser((prevUser) => ({ ...prevUser, ...data.user }));
          if (data.user.currentClass !== "") {
            setSelectedClass(data.user.currentClass);
            filteredLecture();
          }
        })
        .catch((error) => console.log(error));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_URL}/lectures/${selectedClass}`)
        .then((response) => response.json())
        .then((data) => {
          setLectures(data.lectures);
        })
        .catch((error) => console.log(error));
    } else {
      fetch(`${API_URL}/lectures`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const sortedLectures = data.lectures.sort((a, b) => {
            if (a.class !== b.class) {
              return a.class.localeCompare(b.class);
            }
            if (a.subject !== b.subject) {
              return a.subject.localeCompare(b.subject);
            }
            return a.lectureNumber - b.lectureNumber;
          });
          setLectures(sortedLectures);
        })
        .catch((error) => setError(error.message));
    }
  }, [selectedClass]);

  // useEffect(() => {
  //   if (selectedClass === "") {
  //     fetch(`${API_URL}/lectures`)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         const sortedLectures = data.lectures.sort((a, b) => {
  //           if (a.class !== b.class) {
  //             return a.class.localeCompare(b.class);
  //           }
  //           if (a.subject !== b.subject) {
  //             return a.subject.localeCompare(b.subject);
  //           }
  //           return a.lectureNumber - b.lectureNumber;
  //         });
  //         setLectures(sortedLectures);
  //       })
  //       .catch((error) => setError(error.message));
  //   }
  // }, []);

  const filteredLecture = () => {
    return lectures.filter(
      (lecture) =>
        (lecture.class === selectedClass || lecture.class === "") &&
        (selectedSubject === "" || lecture.subject === selectedSubject) &&
        Object.values(lecture).some(
          (field) =>
            (typeof field === "string" || typeof field === "number") &&
            field.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );
  };

  const filteredLectures = filteredLecture();

  const toggleChapter = (chapterName) => {
    setCollapsedChapter(collapsedChapter === chapterName ? null : chapterName);
  };

  const lecturesByChapter = filteredLectures.reduce((acc, lecture) => {
    const { chapterName } = lecture;
    if (!acc[chapterName]) {
      acc[chapterName] = [];
    }
    acc[chapterName].push(lecture);
    return acc;
  }, {});

  const playLecture = (videoId) => {
    setCurrVID(videoId);
    setShowVideoPopup(true);
  };

  if (isLoading) {
    return (
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }

  if (isAdmin) {
    const handleDeleteLecture = (id) => {
      console.log(id);
    };
    return (
      <>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Class</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="selectedClass"
                  name="selectedClass"
                  label="Class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
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
            </Grid>
            <Grid item xs={6} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="selectedSubject"
                  name="selectedSubject"
                  label="Subject"
                  value={selectedSubject === "all" ? "All" : selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {academic &&
                    academic.subjects &&
                    academic.subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.name}>
                        {subject.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControl fullWidth size="small">
                <OutlinedInput
                  sx={{ borderRadius: 10 }}
                  onChange={handleFilterTextChange}
                  startAdornment={
                    <InputAdornment position="start">
                      Search <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={2}>
              <Button
                variant="contained"
                sx={{ borderRadius: 10 }}
                onClick={() => setShowAddLecturePopup(true)}
              >
                Add Lecture
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell align="middle">Class</TableCell>
                  <TableCell align="middle">Subject</TableCell>
                  <TableCell align="middle">Chapter Name</TableCell>
                  <TableCell align="middle">Lecture #</TableCell>
                  <TableCell align="middle">Video ID</TableCell>
                  <TableCell align="middle">Edit or Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
              >
                {filteredLectures &&
                  filteredLectures.map((lecture, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="middle">{lecture.class}</TableCell>
                      <TableCell align="middle">{lecture.subject}</TableCell>
                      <TableCell align="middle">
                        {lecture.chapterName}
                      </TableCell>
                      <TableCell align="middle">
                        {lecture.lectureNumber}
                      </TableCell>
                      <TableCell align="middle">{lecture.videoId}</TableCell>
                      <TableCell align="middle">
                        <Stack direction="row" spacing={1}>
                          <IconButton>
                            <DeleteIcon
                              sx={{ color: "#d33" }}
                              onClick={() => handleDeleteLecture(lecture._id)}
                            />
                          </IconButton>
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  }

  return (
    <>
      {error && <div> Error: {error}</div>}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="selectedClass"
                name="selectedClass"
                label="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
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
          </Grid>
          <Grid item xs={6} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="selectedSubject"
                name="selectedSubject"
                label="Subject"
                value={selectedSubject === "all" ? "All" : selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {academic &&
                  academic.subjects &&
                  academic.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                sx={{ borderRadius: 10 }}
                onChange={handleFilterTextChange}
                startAdornment={
                  <InputAdornment position="start">
                    Search <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={6} sx={{ order: { xs: 1, lg: 2 } }}>
            {showVideoPopup && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: 1 }}
                  color="error"
                  onClick={() => setShowVideoPopup(false)}
                >
                  Close
                </Button>
                <Box sx={{ padding: 1 }}>
                  <YouTubeVideo videoId={currVID} />
                </Box>
              </>
            )}
          </Grid>
          <Grid item xs={12} lg={6} sx={{ order: { xs: 2, lg: 1 } }}>
            <TableContainer component={Paper} style={{ maxHeight: "80vh" }}>
              <Table aria-label="simple table">
                <TableHead className="bg bg-success sticky-top">
                  <TableRow>
                    <TableCell align="center" className="text-white">
                      Subject
                    </TableCell>
                    <TableCell align="center" className="text-white">
                      Chapter
                    </TableCell>
                    <TableCell align="center" className="text-white">
                      # of Lectures
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(lecturesByChapter).map((chapterName, index) => (
                    <React.Fragment key={index}>
                      {(index === 0 ||
                        chapterName !==
                          Object.keys(lecturesByChapter)[index - 1]) && (
                        <TableRow onClick={() => toggleChapter(chapterName)}>
                          <TableCell align="center">
                            {lecturesByChapter[chapterName][0].subject}
                          </TableCell>
                          <TableCell align="center">
                            {lecturesByChapter[chapterName][0].chapterName}
                          </TableCell>
                          <TableCell align="center">
                            {lecturesByChapter[chapterName].length}
                          </TableCell>
                        </TableRow>
                      )}
                      {collapsedChapter === chapterName && (
                        <TableRow key={index + "-collapse"}>
                          <TableCell colSpan="4">
                            <CollapsibleTable
                              lectures={lecturesByChapter[chapterName]}
                              playLecture={playLecture}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
