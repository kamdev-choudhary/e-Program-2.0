import React, { useEffect, useState } from "react";
import YouTubeVideo from "../../components/YouTubeVideoPlayer";
import { useGlobalProvider } from "../../GlobalProvider";
import { API_URL } from "../../constants/helper";
import CustomDropDown from "../../components/CustomDropDown";
import { Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";

import {
  Skeleton,
  Box,
  Select,
  InputLabel,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function CollapsibleTable({ lectures, playLecture }) {
  return (
    <TableContainer dense={true} component={Paper} elevation={3}>
      <Table aria-label="simple table">
        <TableHead sx={{ bgcolor: "#914D7E" }}>
          <TableRow>
            <TableCell align="center" sx={{ color: "#fff" }}>
              Chapter Name
            </TableCell>
            <TableCell align="center" sx={{ color: "#fff" }}>
              Lecture #
            </TableCell>
            <TableCell align="center" sx={{ color: "#fff" }}>
              Video
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lectures.map((lecture, lectureIndex) => (
            <TableRow
              sx={{
                cursor: "pointer",
                ":hover": {
                  bgcolor: "#f2f3f4",
                },
              }}
              key={lectureIndex}
            >
              <TableCell align="center">{lecture.chapterName}</TableCell>
              <TableCell align="center">{lecture.lectureNumber}</TableCell>
              <TableCell align="center">
                <Typography
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      color: "#000",
                    },
                  }}
                  variant="body"
                  color="error"
                  onClick={() => playLecture(lecture.videoId)}
                >
                  &nbsp;Play
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function LecturePage() {
  const { isAdmin, isLoggedIn, userId, accountType } = useGlobalProvider();

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
  const [newLecture, setNewLecture] = useState({
    class: "",
    subject: "",
    chapterName: "",
    lectureNumber: "",
    videoId: "",
  });
  const [filteredTopics, setFilteredTopics] = useState([]);

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
  }, []);

  useEffect(() => {
    if (isLoggedIn && accountType === "student") {
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

  useEffect(() => {
    if (isLoggedIn && accountType === "student") {
      fetch(`${API_URL}/auth/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser((prevUser) => ({ ...prevUser, ...data.user }));
          if (data.user.currentClass !== "") {
            setSelectedClass(data.user.currentClass);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [isLoggedIn]);

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
  useEffect(() => {
    if (newLecture.class && newLecture.subject && academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === newLecture.subject
      );

      if (selectedSubjectData) {
        const filteredTopicss = selectedSubjectData.topics.filter(
          (topic) => topic.className === newLecture.class
        );
        setFilteredTopics(filteredTopicss);
      }
    }
  }, [, newLecture.subject, academic.subjects]);

  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={6} md={6} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#28844f" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>subject</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Chapter Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}># of Lectures</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(10)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box>
        <Grid container spacing={1} component={Paper} sx={{ p: 1, py: 2 }}>
          <Grid size={{ xs: 6, lg: 3 }}>
            <CustomDropDown
              data={academic?.classes}
              value={selectedClass}
              dropdownValue="classes"
              label="Class"
              name="class"
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 6, md: 3 }}>
            <CustomDropDown
              data={academic?.subjects}
              value={selectedSubject}
              dropdownValue="name"
              label="Subject"
              name="name"
            />
          </Grid>
          <Grid item size={{ xs: 12, lg: 6 }}>
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
      <Box sx={{ marginTop: 1 }}>
        <Grid container spacing={1}>
          <Grid item size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 1, lg: 2 } }}>
            {showVideoPopup && (
              <>
                <Box sx={{ padding: 1 }}>
                  <YouTubeVideo videoId={currVID} />
                </Box>
              </>
            )}
          </Grid>
          <Grid item size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 2, lg: 1 } }}>
            <TableContainer component={Paper} style={{ maxHeight: "70vh" }}>
              <Table aria-label="simple table">
                <TableHead
                  sx={{
                    bgcolor: "#28844f",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow sx={{ bgcolor: "#28844f" }}>
                    <TableCell align="center" sx={{ color: "#fff" }}>
                      Subject
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#fff" }}>
                      Chapter
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#fff" }}>
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
                        <TableRow
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              bgcolor: "#f2f3f4",
                            },
                          }}
                          onClick={() => toggleChapter(chapterName)}
                        >
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
