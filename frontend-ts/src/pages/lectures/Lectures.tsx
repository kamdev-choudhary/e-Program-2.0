import React, { useEffect, useState } from "react";
import YouTubeVideo from "../../components/YoutTubeVideoPlayer";
import CustomDropDown from "../../components/CustomDropDown";
import {
  Search as SearchIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Grid2 as Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { getLecturesByClass } from "../../api/lectures";
import { getAllAcademicData } from "../../api/academic";
import { useGlobalContext } from "../../contexts/GlobalProvider";

interface Lecture {
  lectureNumber: number;
  lectureTitle: string;
  chapterName: string;
  subject: string;
  videoId: string;
}

interface AcademicClass {
  name: string;
  value: string;
}

const LecturePage: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const dispatch = useDispatch();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [collapsedChapter, setCollapsedChapter] = useState<string | null>(null);
  const [currVID, setCurrVID] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<AcademicClass[]>([]);

  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilterText(e.target.value);

  const getAcademicData = async () => {
    try {
      const response = await getAllAcademicData();
      if (response && isValidResponse(response)) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLectures = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getLecturesByClass({ classLevel: selectedClass });
      if (response?.data?.lectures) {
        setLectures(response.data.lectures);
      }
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

  const groupedLectures = _.groupBy(lectures, "chapterName");

  const toggleChapter = (chapterName: string) =>
    setCollapsedChapter(collapsedChapter === chapterName ? null : chapterName);

  const playLecture = (videoId: string) => {
    setCurrVID(videoId);
    setShowVideoPopup(true);
  };

  return (
    <>
      <Box>
        <Grid container spacing={1} component={Paper} sx={{ p: 1, py: 2 }}>
          <Grid size={{ xs: 6, xl: 3 }}>
            <CustomDropDown
              data={classes}
              value={selectedClass}
              dropdownValue="value"
              label="Class"
              name="name"
              onChange={(e) =>
                setSelectedClass((e.target as HTMLInputElement).value)
              }
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}></Grid>
          <Grid size={{ xs: 12, xl: 6 }}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                sx={{ borderRadius: 10 }}
                onChange={handleFilterTextChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
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
              <Box sx={{ padding: 1 }}>
                <YouTubeVideo videoId={currVID!} />
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 2, lg: 1 } }}>
            <TableContainer component={Paper} style={{ maxHeight: "70vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Chapter Name</TableCell>
                    <TableCell align="center">Subject</TableCell>
                    <TableCell align="center"># of Lectures</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(groupedLectures).map((chapterName, index) => (
                    <React.Fragment key={index}>
                      <TableRow onClick={() => toggleChapter(chapterName)}>
                        <TableCell align="center">{chapterName}</TableCell>
                        <TableCell align="center">
                          {groupedLectures[chapterName][0]?.subject}
                        </TableCell>
                        <TableCell align="center">
                          {groupedLectures[chapterName].length}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            {collapsedChapter === chapterName ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={collapsedChapter === chapterName}
                            timeout="auto"
                            unmountOnExit
                            sx={{ px: 2 }}
                          >
                            <Box sx={{ margin: 1 }}>
                              {groupedLectures[chapterName].map(
                                (lecture, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingY: 1,
                                    }}
                                  >
                                    <Typography>
                                      Lecture #{lecture.lectureNumber}:{" "}
                                      {lecture.lectureTitle}
                                    </Typography>
                                    <Box
                                      onClick={() =>
                                        playLecture(lecture.videoId)
                                      }
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Typography
                                        sx={{ ml: 1 }}
                                        variant="body2"
                                        color="error"
                                      >
                                        Play
                                      </Typography>
                                    </Box>
                                  </Box>
                                )
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
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
};

export default LecturePage;
