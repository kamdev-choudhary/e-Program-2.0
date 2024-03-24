import React, { useEffect, useState } from "react";
import YouTubeVideo from "../components/YoutubeVideo";
import "./LecturePage.css";

const API_URL = "http://127.0.0.1:5000/api";

// Collapsible Table Component
function CollapsibleTable({ lectures, playLecture }) {
  return (
    <div>
      <table className="table border  border-secondary rounded">
        <thead>
          <tr className="sticky-top">
            <th scope="col ">Chapter Name</th>
            <th scope="col">Lecture Number</th>
            <th scope="col">Video</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture, lectureIndex) => (
            <tr key={lectureIndex}>
              <td>{lecture.chapterName}</td>
              <td>{lecture.lectureNumber}</td>
              <td>
                <span
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => playLecture(lecture.videoId)}
                >
                  <i className="fa-brands fa-youtube"></i> &nbsp;Play
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <div className="col-md-6 text-center">
          <div className="input-group flex-nowrap rounded border border-secondary-emphasis">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              <b>Search</b> &nbsp; &nbsp;&nbsp;
              <i className="fa fa-search"></i>
            </span>
            <input
              className="form-control"
              type="text"
              onChange={handleFilterTextChange}
              name="filterText"
              value={filterText}
            />
          </div>
        </div>
      </div>
      <div className="row lecture-container">
        <hr className="sticky-top" />
        <div
          className="col-md-6"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <table className="table table-hover  table-responsive table-bordered border-secondary-emphasis">
            <thead>
              <tr className="sticky-top ">
                <th scope="col" className="text-center">
                  Class
                </th>
                <th scope="col" className="text-center">
                  Subject
                </th>
                <th scope="col" className="text-start">
                  Chapter
                </th>
                <th scope="col" className="text-center">
                  # of Lecture
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(lecturesByChapter).map((chapterName, index) => (
                <React.Fragment key={index}>
                  {(index === 0 ||
                    chapterName !==
                      Object.keys(lecturesByChapter)[index - 1]) && (
                    <tr>
                      <td
                        className="text-center"
                        onClick={() => toggleChapter(chapterName)}
                      >
                        {lecturesByChapter[chapterName][0].class}
                      </td>
                      <td
                        className="text-center"
                        onClick={() => toggleChapter(chapterName)}
                      >
                        {" "}
                        {lecturesByChapter[chapterName][0].subject}
                      </td>
                      <td onClick={() => toggleChapter(chapterName)}>
                        {chapterName}
                      </td>
                      <td
                        className="text-center"
                        onClick={() => toggleChapter(chapterName)}
                      >
                        {lecturesByChapter[chapterName].length}
                      </td>
                    </tr>
                  )}
                  {/* Render lectures for the chapter if it's expanded */}
                  {collapsedChapter === chapterName && (
                    <tr key={index + "-collapse"}>
                      <td colSpan="4">
                        <CollapsibleTable
                          lectures={lecturesByChapter[chapterName]}
                          playLecture={playLecture}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-6 videoBox ">
          <YouTubeVideo videoId={currVID} />
        </div>
      </div>
    </>
  );
}
