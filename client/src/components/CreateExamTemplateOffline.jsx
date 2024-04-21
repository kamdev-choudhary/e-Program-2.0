import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { TinyBox } from "./TinyBox";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function CreateExamTemplateOffline(handleShowAddTemplate) {
  const [academic, setAcademic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newExamTemplate, setNewExamTemplate] = useState({
    examName: "",
    examPattern: "",
    examInstruction: "",
    className: "",
    questionTypes: {
      singleCorrect: {
        totalQuestions: 0,
        addedQuestions: 0,
        positiveMarks: 3,
        partialMarks: 0,
        negativeMarks: 1,
      },
      multiCorrect: {
        totalQuestions: 0,
        addedQuestions: 0,
        positiveMarks: 4,
        partialMarks: 1,
        negativeMarks: 2,
      },
      integerType: {
        totalQuestions: 0,
        addedQuestions: 0,
        positiveMarks: 3,
        partialMarks: 0,
        negativeMarks: 1,
      },
    },
  });

  useState(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleCreateTemplate = () => {
    fetch(`${API_URL}/exams/createtemplate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExamTemplate),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    handleShowAddTemplate();
  };

  const handleTemplateInputChange = (e) => {
    const { name, value } = e.target;
    setNewExamTemplate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuestionTypeInputChange = (e, type) => {
    const { name, value } = e.target;
    setNewExamTemplate((prevState) => ({
      ...prevState,
      questionTypes: {
        ...prevState.questionTypes,
        [type]: {
          ...prevState.questionTypes[type],
          [name]: value,
        },
      },
    }));
  };

  if (isLoading) {
    return (
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }

  return (
    <>
      <Box padding={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={3}>
            <TextField
              fullWidth
              size="small"
              label="Exam Name"
              name="examName"
              value={newExamTemplate.examName}
              onChange={handleTemplateInputChange}
              id="examName"
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="className"
                name="currentClass"
                label="Class"
                value={newExamTemplate.className}
                onChange={(e) =>
                  setNewExamTemplate({
                    ...newExamTemplate,
                    className: e.target.value,
                  })
                }
              >
                {academic &&
                  academic.classes &&
                  academic.classes.map((classes, index) => (
                    <MenuItem key={index} value={classes}>
                      {classes}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Target</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Exam Pattern"
                name="examPattern"
                value={newExamTemplate.examPattern}
                onChange={handleTemplateInputChange}
              >
                <MenuItem value="JEE">JEE</MenuItem>
                <MenuItem value="NEET">NEET</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box padding={1}>
        <Typography>Exam Instructions</Typography>
        <TinyBox
          content={newExamTemplate.examInstruction}
          onContentChange={(newContent) =>
            setNewExamTemplate({
              ...newExamTemplate,
              examInstruction: newContent,
            })
          }
        />
      </Box>
      <Box padding={1}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Question Type
                </TableCell>
                <TableCell align="center" className="text-white">
                  # of Questions
                </TableCell>
                <TableCell align="center" className="text-white">
                  Positive Marks
                </TableCell>
                <TableCell align="center" className="text-white">
                  Partial
                </TableCell>
                <TableCell align="center" className="text-white">
                  Negative Marks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(newExamTemplate.questionTypes).map(
                ([type, questionType]) => (
                  <TableRow key={type}>
                    <TableCell align="center">{type}</TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-questions`}
                        size="small"
                        type="number"
                        name="totalQuestions"
                        value={questionType.totalQuestions}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-positive`}
                        size="small"
                        type="number"
                        name="positiveMarks"
                        value={questionType.positiveMarks}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-partial`}
                        size="small"
                        type="number"
                        name="partialMarks"
                        value={questionType.partialMarks}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-negative`}
                        size="small"
                        type="number"
                        name="negativeMarks"
                        value={questionType.negativeMarks}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ borderRadius: 10 }}
          onClick={handleCreateTemplate}
        >
          Create template
        </Button>
      </Box>
    </>
  );
}
