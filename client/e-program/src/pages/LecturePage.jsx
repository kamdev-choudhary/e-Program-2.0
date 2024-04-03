import React, { useEffect, useState } from "react";
import YouTubeVideo from "../components/YoutubeVideo";
import "./LecturePage.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = "http://10.0.12.85:5000/api";

// Collapsible Table Component
function CollapsibleTable({ lectures, playLecture }) {
  return (
    <div>
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
              <React.Fragment key={lectureIndex}>
                <TableRow
                  key={lectureIndex}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
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
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default function LecturePage() {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);
  const [collapsedChapter, setCollapsedChapter] = useState(null);
  const [currVID, setCurrVID] = useState(null);
  const [filterText, setFilterText] = useState("");

  const handleFilterTextChange = (e) => {
    setFilterText(e.value);
  };

  useEffect(() => {
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
  }, []);

  // Function to toggle visibility of lectures for a particular chapter
  const toggleChapter = (chapterName) => {
    setCollapsedChapter(collapsedChapter === chapterName ? null : chapterName);
  };

  const lecturesByChapter = lectures.reduce((acc, lecture) => {
    const { chapterName } = lecture;
    if (!acc[chapterName]) {
      acc[chapterName] = [];
    }
    acc[chapterName].push(lecture);
    return acc;
  }, {});

  // Function to set the current video ID when Play button is clicked
  const playLecture = (videoId) => {
    setCurrVID(videoId);
  };

  return (
    <>
      {error && <div>Error: {error}</div>}
      <div className="row mb-2">
        <div className="col-md-12 text-center">
          <FormControl fullWidth sx={{ m: 1 }} size="small">
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">
                  Search <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </div>
      <div className="row lecture-container">
        <div className="col-md-6">
          <TableContainer component={Paper} style={{ maxHeight: "80vh" }}>
            <Table aria-label="simple table">
              <TableHead className="bg bg-success sticky-top">
                <TableRow>
                  <TableCell align="center" className="text-white">
                    Class
                  </TableCell>
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
                      <TableRow>
                        <TableCell
                          align="center"
                          onClick={() => toggleChapter(chapterName)}
                        >
                          {lecturesByChapter[chapterName][0].class}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => toggleChapter(chapterName)}
                        >
                          {lecturesByChapter[chapterName][0].subject}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => toggleChapter(chapterName)}
                        >
                          {lecturesByChapter[chapterName][0].chapterName}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => toggleChapter(chapterName)}
                        >
                          {lecturesByChapter[chapterName].length}
                        </TableCell>
                      </TableRow>
                    )}
                    {/* Render lectures for the chapter if it's expanded */}
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
        </div>
        <div className="col-md-6 videoBox ">
          <YouTubeVideo videoId={currVID} />
        </div>
      </div>
    </>
  );
}
