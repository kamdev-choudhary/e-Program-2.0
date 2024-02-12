import React, { useState } from "react";
import { useEffect } from "react"; // Import useEffect for handling side effects
import Button from "@mui/material/Button";

const LectureTable = ({ lectures }) => {
  const [videoLink, setVideoLink] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleVideoLinkChange = (newLink) => {
    setVideoLink(newLink);
  };

  // Filtered lectures based on selected class, subject, and search query
  const filteredLectures = lectures.filter((lecture) => {
    // Filter by class
    if (selectedClass !== "All" && lecture.class !== selectedClass) {
      return false;
    }
    // Filter by subject
    if (selectedSubject !== "All" && lecture.subject !== selectedSubject) {
      return false;
    }
    // Filter by search query
    if (
      searchQuery &&
      !(
        lecture.chapter_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        lecture.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="row mt-2 mb-2">
        <div className="col-3">
          <select
            className="form-select"
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="All">Select Class</option>
            <option value="IX">Class IX</option>
            <option value="X">Class X</option>
          </select>
        </div>
        <div className="col-3">
          <select
            className="form-select"
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">Select Subject</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Biology">Biology</option>
          </select>
        </div>
        <div className="col-4"></div>
        <div className="col-2 ms-auto">
          <button className="btn btn-success ">Add Lectures</button>
        </div>
      </div>
      <input
        type="text"
        className="mb-2 w-100 p-2"
        id="lecturesearch"
        placeholder="Search for Chapter or Subject"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="row">
        <div className="col-lg-7">
          <div
            className="table-responsive"
            style={{ maxHeight: "77vh", overflowY: "scroll" }}
          >
            <table className="table table-striped">
              <thead className="sticky-top table-success">
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Chapter Name</th>
                  <th>Lecture Number</th>
                  <th>Video Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredLectures.map((lecture) => (
                  <tr key={lecture._id}>
                    <td
                      onClick={() => handleVideoLinkChange(lecture.video_link)}
                    >
                      {lecture.class}
                    </td>
                    <td
                      onClick={() => handleVideoLinkChange(lecture.video_link)}
                    >
                      {lecture.subject}
                    </td>
                    <td
                      onClick={() => handleVideoLinkChange(lecture.video_link)}
                    >
                      {lecture.chapter_name}
                    </td>
                    <td
                      onClick={() => handleVideoLinkChange(lecture.video_link)}
                    >
                      {lecture.lecture_number}
                    </td>
                    <td
                      onClick={() => handleVideoLinkChange(lecture.video_link)}
                    >
                      <Button variant="contained" color="error">
                        Play
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="video-box border ">
            {/* Your video component or iframe here */}
            <iframe
              width="100%"
              height="295px"
              src={videoLink}
              title="Video"
              allowFullScreen="1"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default LectureTable;
