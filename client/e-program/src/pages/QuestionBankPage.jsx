import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./QuestionBankPage.css";
import SingleCorrectQuestion from "../components/SingleCorrectQuestion";
import MultiCorrectQuestion from "../components/MultiCorrectQuestion";
import IntegerType from "../components/IntegerType";
import ViewQuestion from "../components/ViewQuestion";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const API_URL = "http://127.0.0.1:5000/api";

export default function QuestionBankPage() {
  const [error, setError] = useState("");
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currQuestion, setCurrentQuestion] = useState([]);
  const [examTemplates, setExamTemplates] = useState([]);
  const [questionInExamTemplate, setQuestionInExamTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [questionAddToTemplate, setQuestionAddToTemplate] = useState({
    questionId: "",
    examTemplateId: "",
  });
  const [academic, setAcademic] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showViewQuestion, setShowViewQuestion] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState({
    SingleCorrect: false,
    MultiCorrect: false,
    Integer: false,
  });
  const [searchInput, setSearchInput] = useState("");

  // Snackbar
  const handleOpenSnackbar = () => {
    setOpenSuccessSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

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

  const handleFilterDataChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  // const

  // Fetch Question Bank
  useEffect(() => {
    fetch(`${API_URL}/questionbank`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setQuestions(data.questions))
      .catch((error) => setError(error.message));

    fetch(`${API_URL}/exams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setExamTemplates(data.examTemplates))
      .catch((error) => setError(error.message));

    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademic(data.academic[0]))
      .catch((error) => setError(error.message));
  }, [showQuestionModal, showQuestionTypeModal, refresh]);

  // Delete Question
  const handleDeleteQuestion = (question) => {
    fetch("http://127.0.0.1:5000/api/questionbank", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setRefresh(!refresh);
  };

  console.log(academic);

  const handleQuestionToTemplate = (Id) => {
    const updatedQuestionAddToTemplate = {
      ...questionAddToTemplate,
      questionId: Id,
      examTemplateId: selectedTemplate,
    };
    setQuestionAddToTemplate(updatedQuestionAddToTemplate);

    if (updatedQuestionAddToTemplate) {
      fetch("http://127.0.0.1:5000/api/exams/addtotemplate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuestionAddToTemplate),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSnackbarMessage(data);
          handleOpenSnackbar();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    setRefresh(!refresh);
  };

  const handleShowQuestionTypeModal = () => {
    setShowQuestionTypeModal(!showQuestionTypeModal);
  };

  const handleChangeEditMode = () => {
    setEditMode(!editMode);
  };

  const handleShowViewQuestion = (question) => {
    setShowViewQuestion(!showViewQuestion);
    if (question) {
      setCurrentQuestion(question);
    }
  };
  const handleAddQuestion = (e) => {
    const { name } = e.target;
    setShowQuestionModal({
      ...showQuestionModal,
      [name]: true,
    });
  };

  const handleCloseAddQuestion = (modalName) => {
    setShowQuestionModal({
      ...showQuestionModal,
      [modalName]: false,
    });
  };

  const addquestionInExamTemplate = (id) => {
    const qInTemp = examTemplates.filter((template) => template._id === id);
    setQuestionInExamTemplate(qInTemp[0].questions);
    setRefresh(!refresh);
  };

  const handleSelectedTemplate = (e) => {
    if (e.target.value !== "") {
      setSelectedTemplate(e.target.value);
      addquestionInExamTemplate(e.target.value);
    }
  };

  const clearSelectedTemplate = () => {
    setSelectedTemplate("");
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filterdQuestions = questions.filter((question) =>
    Object.values(question).some(
      (field) =>
        (typeof field === "string" || typeof field === "number") &&
        field.toString().toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  return (
    <>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="row">
        <div className="col-md-3 mb-3">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="classes"
                label="Class"
                value={filterData.classes}
                onChange={handleFilterDataChange}
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
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subject"
                label="Subject"
                value={filterData.subject}
                onChange={handleFilterDataChange}
              >
                {academic &&
                  academic.subjects &&
                  academic.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject}>
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
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="topic"
                label="topic"
                value={filterData.topic}
                onChange={handleFilterDataChange}
              >
                {/* {uniqueTopic.map((topic, index) => (
                  <MenuItem key={index} value={topic}>
                    {topic}
                  </MenuItem>
                ))} */}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subtopic"
                label="subtopic"
                value={filterData.subtopic}
                onChange={handleFilterDataChange}
              >
                {/* {uniqueSubjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))} */}
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
                value={filterData.difficulty_level}
                onChange={handleFilterDataChange}
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
                value={filterData.timeRequired}
                onChange={handleFilterDataChange}
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
                value={filterData.target}
                onChange={handleFilterDataChange}
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
      <hr />
      <div className="row ">
        <div className="col-md-6 ">
          <FormControl fullWidth size="small">
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">
                  Search <SearchIcon />
                </InputAdornment>
              }
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </FormControl>
        </div>
        <div className="col-md-2 d-flex justify-content-center align-items-center">
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            onClick={handleShowQuestionTypeModal}
          >
            <AddIcon />
          </Fab>
        </div>
        <div className="col-md-1 d-flex justify-content-center align-items-center">
          <FormControlLabel
            control={
              <Switch
                checked={editMode}
                onChange={handleChangeEditMode}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Delete"
          />
        </div>
        <div className="col-md-3 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Exam Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="examTemplate"
                label="Exam Group"
                value={selectedTemplate}
                onChange={handleSelectedTemplate}
                endAdornment={
                  selectedTemplate && (
                    <IconButton size="small" onClick={clearSelectedTemplate}>
                      <ClearIcon />
                    </IconButton>
                  )
                }
              >
                {examTemplates.map((examTemplate, index) => (
                  <MenuItem key={index} value={examTemplate._id}>
                    {examTemplate.examName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <hr />
      <div className="mt-2">
        <TableContainer component={Paper} style={{ maxHeight: "80vh" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg bg-success sticky-top">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Question ID
                </TableCell>
                <TableCell align="center" className="text-white">
                  Queston
                </TableCell>
                <TableCell align="center" className="text-white">
                  View
                </TableCell>
                <TableCell align="center" className="text-white">
                  Approved
                </TableCell>
                <TableCell align="center" className="text-white">
                  Subject
                </TableCell>
                <TableCell align="center" className="text-white">
                  Topic
                </TableCell>
                <TableCell align="center" className="text-white">
                  SubTopic
                </TableCell>
                <TableCell align="center" className="text-white">
                  D Level
                </TableCell>
                {editMode && (
                  <TableCell className="text-white" align="center">
                    Delete
                  </TableCell>
                )}
                {selectedTemplate && (
                  <TableCell className="text-white" align="center">
                    Add to Group
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filterdQuestions.map((question, index) => (
                <TableRow
                  key={question._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{question.questionId}</TableCell>
                  <TableCell>{question.questionText}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="sm"
                      onClick={() => {
                        handleShowViewQuestion(question);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center">{question.isApproved}</TableCell>
                  <TableCell align="center">{question.subject}</TableCell>
                  <TableCell align="center">{question.topic}</TableCell>
                  <TableCell align="center">{question.subtopic}</TableCell>
                  <TableCell align="center">
                    {question.difficulty_level}
                  </TableCell>
                  {editMode && (
                    <TableCell scope="col" className="text-center">
                      <i
                        className="fa-solid fa-trash"
                        onClick={() => handleDeleteQuestion(question)}
                        style={{ color: "brown" }}
                      ></i>
                    </TableCell>
                  )}
                  {selectedTemplate && (
                    <TableCell scope="col" className="text-center">
                      {!questionInExamTemplate.includes(question._id) ? (
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleQuestionToTemplate(question._id)}
                        >
                          Add
                        </button>
                      ) : (
                        <button className="btn btn-success" disabled>
                          Added
                        </button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal show={showQuestionTypeModal} onHide={handleShowQuestionTypeModal}>
        <Modal.Header>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            <button
              className="btn btn-success"
              type="button"
              name="SingleCorrect"
              onClick={handleAddQuestion}
            >
              Single Correct Question
            </button>
            <button
              className="btn btn-success"
              type="button"
              name="MultiCorrect"
              onClick={handleAddQuestion}
            >
              Multi Correct Question
            </button>
            <button
              className="btn btn-success"
              type="button"
              name="Integer"
              onClick={handleAddQuestion}
            >
              Integer Type Question
            </button>
            <button
              className="btn btn-success"
              type="button"
              name="MultiCorrect"
              onClick={handleAddQuestion}
            >
              Comprehensive Question
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowQuestionTypeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showQuestionModal.SingleCorrect}
        onHide={() => handleCloseAddQuestion("SingleCorrect")}
        dialogClassName="modal-xl"
      >
        <Modal.Header>
          <Modal.Title>Single Correct Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SingleCorrectQuestion
            handleCloseAddQuestion={handleCloseAddQuestion}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            name="SingleCorrect"
            onClick={() => handleCloseAddQuestion("SingleCorrect")}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showQuestionModal.MultiCorrect}
        onHide={() => handleCloseAddQuestion("MultiCorrect")}
        dialogClassName="modal-xl"
      >
        <Modal.Header>
          <Modal.Title>Multi Correct Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MultiCorrectQuestion />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            name="MultiCorrect"
            onClick={() => handleCloseAddQuestion("MultiCorrect")}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showQuestionModal.Integer}
        onHide={() => handleCloseAddQuestion("Integer")}
        dialogClassName="modal-xl"
      >
        <Modal.Header>
          <Modal.Title>Integer Type Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IntegerType />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            name="Integer"
            onClick={() => handleCloseAddQuestion("Integer")}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showViewQuestion}
        onHide={handleShowViewQuestion}
        dialogClassName="modal-xl"
      >
        <Modal.Header> View Question</Modal.Header>
        <Modal.Body>
          <ViewQuestion currQuestion={currQuestion} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowViewQuestion}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
