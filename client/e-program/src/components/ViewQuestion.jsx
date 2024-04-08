import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TinyBox, TinyBox2 } from "./TinyBox";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ViewQuestion(props) {
  const [academic, setAcademicData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [question, setQuestion] = useState({
    ...props.currQuestion,
    isApproved: "Yes",
  });

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademicData(data.academic[0]))
      .catch((error) => setError(error.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({ ...prevQuestion, [name]: value }));
  };

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

  const handleTinyBoxChange = (name, newContent) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: newContent,
    }));
  };
  return (
    <>
      <Paper elevation={6} sx={{ padding: "20px" }}>
        <Typography>
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
                    onChange={handleChange}
                  >
                    {academic.classes &&
                      academic.classes.map((classes, index) => (
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
                <FormControl fullWidth size="small">
                  <InputLabel id="subject-label">Subject</InputLabel>
                  <Select
                    labelId="subject-label"
                    label="Subject"
                    id="subject-select"
                    name="subject"
                    value={question.subject || ""}
                    onChange={handleChange}
                  >
                    {academic.subjects &&
                      academic.subjects.map((subject, index) => (
                        <MenuItem key={index} value={subject.name}>
                          {subject.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="col-md-3 mb-2">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="topic-label">Topic</InputLabel>
                  <Select
                    labelId="topic-label"
                    id="selectTopic"
                    name="topic"
                    label="Topic"
                    value={question.topic || ""}
                    onChange={handleChange}
                  >
                    {filteredTopics &&
                      filteredTopics.map((topic, index) => (
                        <MenuItem key={index} value={topic.name}>
                          {topic.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>

            <div className="col-md-3 mb-2">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="subtopic-label">Subtopic</InputLabel>
                  <Select
                    labelId="subtopic-label"
                    id="selectSubtopic"
                    name="subtopic"
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

            <div className="col-md-3 mb-2">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Difficulty Level
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="difficultyLevel"
                    label="difficultyLevel"
                    value={question.difficultyLevel || ""}
                    onChange={handleChange}
                  >
                    {academic &&
                      academic.difficultyLevel &&
                      academic.difficultyLevel.map((dLevel, index) => (
                        <MenuItem key={index} value={dLevel}>
                          {dLevel}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="col-md-3 mb-2">
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
                    value={question.timeRequired || ""}
                    onChange={handleChange}
                  >
                    {academic &&
                      academic.timeRequired &&
                      academic.timeRequired.map((time, index) => (
                        <MenuItem key={index} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="col-md-3 mb-2">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Target</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="target"
                    label="target"
                    value={question.target || ""}
                    onChange={handleChange}
                  >
                    {academic &&
                      academic.target &&
                      academic.target.map((tget, index) => (
                        <MenuItem key={index} value={tget}>
                          {tget}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
        </Typography>
        <hr />
        <FormControl>
          <Typography>Question</Typography>
          <Grid container fullWidth>
            <Grid item>
              <TinyBox
                content={question.questionText}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("questionText", newContent)
                }
              />
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
              <Typography variant="h5" align="center">
                1
              </Typography>
            </Grid>
            <Grid item xs={12} sm={1} alignContent="center">
              <Checkbox color="success" />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TinyBox2
                content={question.option1}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option1", newContent)
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography variant="h5" align="center">
                2
              </Typography>
            </Grid>
            <Grid item xs={12} sm={1} alignContent="center">
              <Checkbox color="success" />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TinyBox2
                content={question.option2}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option2", newContent)
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography variant="h5" align="center">
                3
              </Typography>
            </Grid>
            <Grid item xs={12} sm={1} alignContent="center">
              <Checkbox color="success" />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TinyBox2
                content={question.option3}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option3", newContent)
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={1} alignContent="center">
              <Typography variant="h5" align="center">
                4
              </Typography>
            </Grid>
            <Grid item xs={12} sm={1} alignContent="center">
              <Checkbox color="success" />
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TinyBox2
                content={question.option4}
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
              <TinyBox2
                content={question.solution}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("solution", newContent)
                }
              />
            </Grid>
          </Grid>
        </FormControl>

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
          <Button variant="contained">Save</Button>
          <Button variant="contained" color="success">
            Save and Approve
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
