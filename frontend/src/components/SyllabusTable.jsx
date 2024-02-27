import React, { useState } from "react";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

const SyllabusTable = ({ syllabuses }) => {
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered syllabus based on selected class, subject, and search query
  const filteredsyllabuses = syllabuses.filter((syllabus) => {
    // Filter by class
    if (selectedClass !== "All" && syllabus.class !== selectedClass) {
      return false;
    }
    // Filter by subject
    if (selectedSubject !== "All" && syllabus.subject !== selectedSubject) {
      return false;
    }
    // Filter by search query
    if (
      searchQuery &&
      !(
        syllabus.chapter_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        syllabus.subject.toLowerCase().includes(searchQuery.toLowerCase())
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
          <button className="btn btn-success ">Add syllabus</button>
        </div>
      </div>
      <input
        type="text"
        className="mb-2 w-100 p-2"
        id="syllabusearch"
        placeholder="Search for Chapter or Subject"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="row">
        <div className="col-lg">
          <div
            className="table-responsive"
            style={{ maxHeight: "77vh", overflowY: "auto" }}
          >
            <table className="table table-striped">
              <thead className="sticky-top table-success">
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Chapter Name</th>
                  <th>Number of Lectures </th>
                </tr>
              </thead>
              <tbody>
                {filteredsyllabuses.map((syllabus) => (
                  <tr key={uuidv4()}>
                    <td>{syllabus.class}</td>
                    <td>{syllabus.subject}</td>
                    <td>{syllabus.chapter_name}</td>
                    <td>{syllabus.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyllabusTable;
