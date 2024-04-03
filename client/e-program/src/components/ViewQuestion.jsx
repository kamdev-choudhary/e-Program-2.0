import React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const API_URL = "http://10.0.12.85:5000/api";

export default function ViewQuestion(props) {
  const [academic, setAcademic] = useState([]);
  const [filterData, setFilterData] = useState({
    classes: "",
    subject: "",
    topic: "",
    subtopic: "",
    difficulty_level: "",
    timeRequired: "",
    target: "",
    examTemplates: "",
  });
  const [questionData, setQuestionData] = useState({
    classes: "",
    subject: "",
    topic: "",
    subtopic: "",
    questionType: "singleCorrect",
    isApproved: "No",
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    solution: "",
  });

  const handleFilterDataChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const uniqueClasses = [...new Set(academic.map((item) => item.class))];
  const uniqueSubjects = [...new Set(academic.map((item) => item.subject))];
  const uniqueTopic = [...new Set(academic.map((item) => item.topic))];

  useEffect(() => {
    fetch(`${API_URL}/admin/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademic(data.academic))
      .catch((error) => setError(error.message));
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="classes"
                label="Class"
                value={filterData.classes}
                onChange={handleFilterDataChange}
              >
                {uniqueClasses.map((classes, index) => (
                  <MenuItem key={index} value={classes}>
                    {classes}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subject"
                label="Subject"
                value={filterData.subject}
                onChange={handleFilterDataChange}
              >
                {uniqueSubjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="topic"
                label="topic"
                value={filterData.topic}
                onChange={handleFilterDataChange}
              >
                {uniqueTopic.map((topic, index) => (
                  <MenuItem key={index} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subtopic"
                label="subtopic"
                value={filterData.subtopic}
                onChange={handleFilterDataChange}
              >
                {uniqueSubjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                DiffiCulty Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="difficulty_level"
                label="difficulty_level"
                value={filterData.difficulty_level}
                onChange={handleFilterDataChange}
              >
                {uniqueSubjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Time Required
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="timeRequired"
                label="timeRequired"
                value={filterData.timeRequired}
                onChange={handleFilterDataChange}
              >
                {uniqueSubjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Target</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="target"
                label="target"
                value={filterData.target}
                onChange={handleFilterDataChange}
              >
                <MenuItem value="Both">Both</MenuItem>
                <MenuItem value="JEE">JEE</MenuItem>
                <MenuItem value="NEET">NEET</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>

      {/* Single Correct */}
      <div className="col-12 mt-2 p-2 border rounded">
        <div className="mb-3 ">
          <p>Question</p>
          <textarea
            name="questionText"
            id="questionText mt-3"
            className="form-control mt-3"
            cols="10"
            value={props.currQuestion.questionText}
            rows="5"
            placeholder="Enter question"
            readOnly
            style={{ resize: "none" }}
          ></textarea>
        </div>
      </div>
      <p className="mt-2 ">Options</p>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="1"
            checked={props.currQuestion.correctAnswer === "1"}
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option1}
          placeholder="option 1"
          readOnly
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="2"
            checked={props.currQuestion.correctAnswer === "2"}
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option2}
          placeholder="option 2"
          readOnly
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="3"
            checked={props.currQuestion.correctAnswer === "3"}
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option3}
          placeholder="option 4"
          checked={props.currQuestion.correctAnswer === "4"}
          readOnly
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="1"
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option4}
          placeholder="option 2"
          readOnly
        />
      </div>
      <hr />
      <div className="col-12 mt-2 p-2 border rounded">
        <div className="mb-3 ">
          <p>Solution</p>
          <textarea
            name="questionText"
            id="questionText mt-3"
            className="form-control mt-3"
            cols="10"
            value={props.currQuestion.solution}
            rows="5"
            placeholder="Enter question"
            readOnly
          ></textarea>
        </div>
      </div>
    </>
  );
}
