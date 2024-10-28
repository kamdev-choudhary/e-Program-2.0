import React, { useEffect, useState } from "react";
import YouTubeVideo from "../../components/YouTubeVideoPlayer";
import { useGlobalProvider } from "../../GlobalProvider";
import { API_URL, icons } from "../../constants/helper";
import CustomDropDown from "../../components/CustomDropDown";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import axios from "axios";

import {
  Box,
  InputAdornment,
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
              onClick={() => playLecture(lecture.videoId)}
              sx={{
                cursor: "pointer",
                ":hover": {
                  bgcolor: "#f2f2f2",
                },
              }}
              key={lectureIndex}
            >
              <TableCell align="center">{lecture.chapterName}</TableCell>
              <TableCell align="center">{lecture.lectureNumber}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img src={icons.youTube} height={25} width={25} />
                  <Typography variant="body" color="error">
                    Play
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function LecturePage() {
  const { isLoggedIn, isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [lectures, setLectures] = useState([]);
  const [collapsedChapter, setCollapsedChapter] = useState(null);
  const [currVID, setCurrVID] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState("IX");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classes, setClasses] = useState([]);

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  const getLectures = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${API_URL}/lectures`);
      if (isValidResponse(response)) {
        const sortedLectures = response?.data?.lectures.sort((a, b) => {
          if (a.class !== b.class) {
            return a.class.localeCompare(b.class);
          }
          if (a.subject !== b.subject) {
            return a.subject.localeCompare(b.subject);
          }
          return a.lectureNumber - b.lectureNumber;
        });
        setLectures(sortedLectures);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getLectures();
  }, []);

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

  return (
    <>
      <Box>
        <Grid container spacing={1} component={Paper} sx={{ p: 1, py: 2 }}>
          <Grid size={{ xs: 6, lg: 3 }}>
            <CustomDropDown
              data={[{ class: "Class IX", classes: "IX" }]}
              value={selectedClass}
              dropdownValue="classes"
              label="Class"
              name="class"
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}></Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
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
          <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 1, lg: 2 } }}>
            {showVideoPopup && (
              <>
                <Box sx={{ padding: 1 }}>
                  <YouTubeVideo videoId={currVID} />
                </Box>
              </>
            )}
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 2, lg: 1 } }}>
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
