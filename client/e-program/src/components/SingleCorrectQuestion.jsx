import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

import { TinyBox, TinyBox2 } from "./TinyBox";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function SingleCorrectQuestion(props) {
  const [academic, setAcademic] = useState([]);
  const [error, setError] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]); // Added filteredSubtopics state
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

  const [validationError, setValidationError] = useState({
    classes: "",
    subject: "",
    topic: "",
    subtopic: "",
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    solution: "",
  });

  useEffect(() => {
    if (props.selectedSubject) {
      setQuestionData((prevQuestionData) => ({
        ...prevQuestionData,
        subject: props.selectedSubject,
      }));
    }
    if (props.selectedClass) {
      setQuestionData((prevQuestionData) => ({
        ...prevQuestionData,
        classes: props.selectedClass,
      }));
    }
  }, [props.selectedClass, props.selectedSubject]); // Added props.selectedSubject as dependency

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademic(data.academic[0]))
      .catch((error) => setError(error.message));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    switch (name) {
      case "classes":
        errorMessage = value ? "" : "Class is required";
        break;
      case "subject":
        errorMessage = value ? "" : "Subject is required";
        break;
      case "topic":
        errorMessage = value ? "" : "Topic is required";
        break;
      case "subtopic":
        errorMessage = value ? "" : "Subtopic is required";
        break;
      case "questionText":
        errorMessage = value ? "" : "Question is required";
        break;
      case "option1":
        errorMessage = value ? "" : "Option 1 is required";
        break;
      case "option2":
        errorMessage = value ? "" : "Option 2 is required";
        break;
      case "option3":
        errorMessage = value ? "" : "Option 3 is required";
        break;
      case "option4":
        errorMessage = value ? "" : "Option 4 is required";
        break;
      case "correctAnswer":
        errorMessage = value ? "" : "Correct answer is required";
        break;
      case "solution":
        errorMessage = value ? "" : "Solution is required";
        break;
      default:
        break;
    }
    setValidationError({
      ...validationError,
      [name]: errorMessage,
    });

    // Update question data state
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      fetch(`${API_URL}/questionbank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          props.handleCloseAddQuestion("SingleCorrect");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("Validation failed");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const NewError = {};
    for (const key in questionData) {
      if (!questionData[key]) {
        isValid = false;
        NewError[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      } else {
        NewError[key] = "";
      }
    }
    setValidationError(NewError);
    return isValid;
  };

  useEffect(() => {
    if (questionData.classes && questionData.subject && academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === questionData.subject
      );
      if (selectedSubjectData) {
        const filteredTopics = selectedSubjectData.topics.filter(
          (topic) => topic.className === questionData.classes
        );
        setFilteredTopics(filteredTopics);
      }
    }
  }, [questionData.classes, questionData.subject, academic.subjects]);

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics
        .filter(
          (topic) => !questionData.topic || topic.name === questionData.topic
        )
        .flatMap((topic) => topic.subtopics);
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics, questionData.topic]);

  const handleTinyBoxChange = (name, newContent) => {
    setQuestionData((prevQuestion) => ({
      ...prevQuestion,
      [name]: newContent,
    }));
  };

  return (
    <>
      <div className="container mt-2 border rounded">
        <div className="row mt-2">
          <div className="col-md-3 mb-3">
            <Box sx={{ minWidth: 120 }}>
              <FormControl
                fullWidth
                size="small"
                error={Boolean(validationError.classes)}
              >
                <InputLabel id="demo-simple-select-label">Class</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="classes"
                  label="Class"
                  value={questionData.classes}
                  onChange={handleInputChange}
                >
                  {academic &&
                    academic.classes &&
                    academic.classes.map((classes, index) => (
                      <MenuItem key={index} value={classes}>
                        {classes}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{validationError.classes}</FormHelperText>
              </FormControl>
            </Box>
          </div>
          <div className="col-md-3 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl
                fullWidth
                size="small"
                error={Boolean(validationError.subject)}
              >
                <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="subject"
                  label="Subject"
                  value={questionData.subject}
                  onChange={handleInputChange}
                >
                  {academic &&
                    academic.subjects &&
                    academic.subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.name}>
                        {subject.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{validationError.subject}</FormHelperText>
              </FormControl>
            </Box>
          </div>
          <div className="col-md-3 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl
                fullWidth
                size="small"
                error={Boolean(validationError.topic)}
              >
                <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                <Select
                  labelId="Topic Selection"
                  id="selectTopic"
                  name="topic"
                  label="topic"
                  value={questionData.topic}
                  onChange={handleInputChange}
                >
                  {filteredTopics &&
                    filteredTopics.map((topics, index) => (
                      <MenuItem key={index} value={topics.name}>
                        {topics.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{validationError.topic}</FormHelperText>
              </FormControl>
            </Box>
          </div>
          <div className="col-md-3 mb-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl
                fullWidth
                size="small"
                error={Boolean(validationError.subtopic)}
              >
                <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="subtopic"
                  label="subtopic"
                  value={questionData.subtopic}
                  onChange={handleInputChange}
                >
                  {filteredSubtopics.length > 0 ? (
                    filteredSubtopics.map((subTopic, index) => (
                      <MenuItem key={index} value={subTopic.name}>
                        {subTopic.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No Subtopics available</MenuItem>
                  )}
                </Select>
                <FormHelperText>{validationError.subtopic}</FormHelperText>
              </FormControl>
            </Box>
          </div>
        </div>
      </div>
      <Paper sx={{ padding: 4 }} elevation={4}>
        <>
          <FormControl error={Boolean(validationError.questionText)}>
            <Typography>Question</Typography>
            <Grid container fullWidth>
              <Grid item>
                <TinyBox
                  content={questionData.questionText}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("questionText", newContent)
                  }
                />
              </Grid>
            </Grid>
            <FormHelperText>{validationError.questionText}</FormHelperText>
          </FormControl>
          <hr />
          <FormControl fullWidth>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Options
            </FormLabel>
            <Grid
              container
              spacing={1}
              error={Boolean(validationError.option1)}
            >
              <Grid item xs={12} sm={1}>
                <Typography>1</Typography>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Checkbox
                  color="success"
                  name="correctAnswer"
                  value="1"
                  checked={questionData.correctAnswer === "1"}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TinyBox2
                  content={questionData.option1}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option1", newContent)
                  }
                />
              </Grid>
              <FormHelperText>{validationError.option1}</FormHelperText>
            </Grid>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={12} sm={1}>
                <Typography>2</Typography>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Checkbox
                  color="success"
                  name="correctAnswer"
                  value="2"
                  checked={questionData.correctAnswer === "2"}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TinyBox2
                  content={questionData.option2}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option2", newContent)
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={12} sm={1}>
                <Typography>3</Typography>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Checkbox
                  color="success"
                  name="correctAnswer"
                  value="3"
                  checked={questionData.correctAnswer === "3"}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TinyBox2
                  content={questionData.option3}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option3", newContent)
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={12} sm={1}>
                <Typography>4</Typography>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Checkbox
                  color="success"
                  name="correctAnswer"
                  value="4"
                  checked={questionData.correctAnswer === "4"}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TinyBox2
                  content={questionData.option4}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("option4", newContent)
                  }
                />
              </Grid>
            </Grid>

            <hr />
            <Typography>Solution</Typography>
            <Grid container>
              <Grid item fullWidth>
                <TinyBox
                  content={questionData.solution}
                  onContentChange={(newContent) =>
                    handleTinyBoxChange("solution", newContent)
                  }
                />
              </Grid>
            </Grid>
          </FormControl>
        </>
        <Stack
          spacing={2}
          padding={0}
          direction="row"
          style={{
            bottom: 0,
            right: 0,
            marginTop: 20,
          }}
          justifyContent="flex-end" // Align items to the right side
        >
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
