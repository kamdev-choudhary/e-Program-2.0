import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  Button,
  Paper,
  Grid,
  Typography,
  FormLabel,
  Stack,
} from "@mui/material";
import { TinyBox, TinyBox2, TinyBoxReadOnly } from "./TinyBox";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ViewQuestion = ({ currQuestion, handleShowViewQuestion, setRefresh }) => {
  const [academic, setAcademicData] = useState({});
  const [error, setError] = useState(null);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [question, setQuestion] = useState(currQuestion);
  const [readOnly, setReadOnly] = useState(question.isApproved === "Yes");
  const [editMode, setEditMode] = useState(false);

  const fetchAcademicData = useCallback(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAcademicData(data.academic[0]);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    fetchAcademicData();
  }, [fetchAcademicData]);

  useEffect(() => {
    if (question.classes && question.subject && academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === question.subject
      );
      if (selectedSubjectData) {
        const filteredTopics = selectedSubjectData.topics.filter(
          (topic) => topic.className === question.classes
        );
        setFilteredTopics(filteredTopics);
      }
    }
  }, [question, academic]);

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics
        .filter((topic) => !question.topic || topic.name === question.topic)
        .flatMap((topic) => topic.subtopics);
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics, question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({ ...prevQuestion, [name]: value }));
  };

  const handleTinyBoxChange = (name, newContent) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: newContent,
    }));
  };

  const updateQuestion = (approve) => {
    const updatedQuestion = { ...question, isApproved: approve ? "Yes" : "No" };
    fetch(`${API_URL}/questionbank/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        handleShowViewQuestion();
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      {readOnly && (
        <div className="row  mb-3">
          <div className="col-md-1 ms-auto">
            <Button variant="contained" onClick={() => setReadOnly(false)}>
              Edit
            </Button>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="class-label">Class</InputLabel>
              <Select
                labelId="class-label"
                id="class-select"
                value={question.classes || ""}
                label="Class"
                name="classes"
                readOnly={readOnly}
                onChange={handleChange}
              >
                {academic && academic.classes
                  ? academic.classes.map((classes, index) => (
                      <MenuItem key={index} value={classes}>
                        {classes}
                      </MenuItem>
                    ))
                  : question.classes && (
                      <MenuItem value={question.classes}>
                        {question.classes}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                label="Subject"
                id="subject-select"
                name="subject"
                readOnly={readOnly}
                value={question.subject}
                onChange={handleChange}
              >
                {academic && academic.subjects
                  ? academic.subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.name}>
                        {subject.name}
                      </MenuItem>
                    ))
                  : question.subject && (
                      <MenuItem value={question.subject}>
                        {question.subject}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="topic-label">Topic</InputLabel>
              <Select
                labelId="topic-label"
                id="selectTopic"
                name="topic"
                label="Topic"
                readOnly={readOnly}
                value={question.topic || ""}
                onChange={handleChange}
              >
                {filteredTopics
                  ? filteredTopics.map((topic, index) => (
                      <MenuItem key={index} value={topic.name}>
                        {topic.name}
                      </MenuItem>
                    ))
                  : question.topic && (
                      <MenuItem value={question.topic}>
                        {question.topic}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="subtopic-label">Subtopic</InputLabel>
              <Select
                labelId="subtopic-label"
                id="selectSubtopic"
                name="subtopic"
                readOnly={readOnly}
                label="Subtopic"
                value={question.subtopic || ""}
                onChange={handleChange}
              >
                {filteredSubtopics &&
                  filteredSubtopics.map((subtopic, index) => (
                    <MenuItem key={index} value={subtopic.name}>
                      {subtopic.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Difficulty Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="difficultyLevel"
                readOnly={readOnly}
                label="difficultyLevel"
                value={question.difficultyLevel || ""}
                onChange={handleChange}
              >
                {academic && academic.difficultyLevel
                  ? academic.difficultyLevel.map((Dlevel, index) => (
                      <MenuItem key={index} value={Dlevel}>
                        {Dlevel}
                      </MenuItem>
                    ))
                  : question.difficultyLevel && (
                      <MenuItem value={question.difficultyLevel}>
                        {question.difficultyLevel}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Time Required
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="timeRequired"
                label="timeRequired"
                readOnly={readOnly}
                value={question.timeRequired || ""}
                onChange={handleChange}
              >
                {academic && academic.timeRequired
                  ? academic.timeRequired.map((time, index) => (
                      <MenuItem key={index} value={time}>
                        {time}
                      </MenuItem>
                    ))
                  : question.timeRequired && (
                      <MenuItem value={question.timeRequired}>
                        {question.timeRequired}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Target</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="target"
                label="target"
                readOnly={readOnly}
                value={question.target || ""}
                onChange={handleChange}
              >
                {academic && academic.target
                  ? academic.target.map((tget, index) => (
                      <MenuItem key={index} value={tget}>
                        {tget}
                      </MenuItem>
                    ))
                  : question.target && (
                      <MenuItem value={question.target}>
                        {question.target}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <hr style={{ color: "#000" }} />
      <div style={{ padding: "10px" }}>
        <FormControl fullWidth>
          <Typography>Question</Typography>
          <Grid container fullWidth>
            <Grid item>
              {readOnly ? (
                <TinyBoxReadOnly content={question.questionText} height={200} />
              ) : (
                <TinyBox
                  content={question.questionText}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("questionText", newContent)
                  }
                />
              )}
            </Grid>
          </Grid>
        </FormControl>
        <hr />
        <FormControl fullWidth>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Options
          </FormLabel>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography align="center">1</Typography>
            </Grid>
            <Grid item xs={12} sm={1} align="center" alignContent="center">
              <Checkbox
                name="correctAnswer"
                align="center"
                value="1"
                color="success"
                readOnly={!readOnly}
                checked={question.correctAnswer === "1"}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              {readOnly ? (
                <TinyBoxReadOnly content={question.option1} height={100} />
              ) : (
                <TinyBox2
                  content={question.option1}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option1", newContent)
                  }
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography align="center">2</Typography>
            </Grid>
            <Grid item xs={12} sm={1} align="center" alignContent="center">
              <Checkbox
                name="correctAnswer"
                align="center"
                value="2"
                color="success"
                readOnly={readOnly}
                checked={question.correctAnswer === "2"}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              {readOnly ? (
                <TinyBoxReadOnly content={question.option2} height={100} />
              ) : (
                <TinyBox2
                  content={question.option2}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option2", newContent)
                  }
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography align="center">3</Typography>
            </Grid>
            <Grid item xs={12} sm={1} align="center" alignContent="center">
              <Checkbox
                name="correctAnswer"
                align="center"
                value="3"
                color="success"
                readOnly={readOnly}
                checked={question.correctAnswer === "3"}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              {readOnly ? (
                <TinyBoxReadOnly content={question.option3} height={100} />
              ) : (
                <TinyBox2
                  content={question.option3}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option3", newContent)
                  }
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography align="center">4</Typography>
            </Grid>
            <Grid item xs={12} sm={1} alignContent="center" align="center">
              <Checkbox
                name="correctAnswer"
                value="4"
                align="center"
                color="success"
                readOnly={readOnly}
                checked={question.correctAnswer === "4"}
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              {readOnly ? (
                <TinyBoxReadOnly content={question.option4} height={100} />
              ) : (
                <TinyBox2
                  content={question.option4}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option4", newContent)
                  }
                />
              )}
            </Grid>
          </Grid>
        </FormControl>
        <hr />
        <Typography>Solution</Typography>
        <Grid container>
          <Grid item fullWidth>
            {readOnly ? (
              <TinyBoxReadOnly
                content={question.solution}
                height={100}
                width={300}
              />
            ) : (
              <TinyBox2
                content={question.solution}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("solution", newContent)
                }
              />
            )}
          </Grid>
        </Grid>

        {!readOnly && (
          <Stack
            spacing={2}
            padding={0}
            direction="row"
            style={{ bottom: 0, right: 0, marginTop: 20 }}
            justifyContent="flex-end"
          >
            <Button variant="contained" onClick={() => updateQuestion(false)}>
              Save
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => updateQuestion(true)}
            >
              Save and Approve
            </Button>
          </Stack>
        )}
      </div>
    </>
  );
};

export default ViewQuestion;
