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

const API_URL = "http://127.0.0.1:5000/api";

export default function QuestionBankPage() {
  const [error, setError] = useState("");

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
  const [addToTemplate, setAddToTemplate] = useState(false);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showViewQuestion, setShowViewQuestion] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState({
    SingleCorrect: false,
    MultiCorrect: false,
    Integer: false,
  });

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

  const uniqueClasses = [...new Set(academic.map((item) => item.class))];
  const uniqueSubjects = [...new Set(academic.map((item) => item.subject))];
  const uniqueTopic = [...new Set(academic.map((item) => item.topic))];

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

    fetch(`${API_URL}/admin/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademic(data.academic))
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

  //Add Question to Group
  const handleQuestionToTemplate = (Id) => {
    setQuestionAddToTemplate({
      ...questionAddToTemplate,
      questionId: Id,
      examTemplateId: selectedTemplate,
    });
    fetch("http://127.0.0.1:5000/api/exams/addtotemplate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionAddToTemplate),
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

  const handleShowQuestionTypeModal = () => {
    setShowQuestionTypeModal(!showQuestionTypeModal);
  };

  const handleChangeEditMode = () => {
    setEditMode(!editMode);
  };

  const handleAddToTemplate = () => {
    setAddToTemplate(!addToTemplate);
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

  return (
    <>
      <div className="row">
        <div className="col-md-4 mb-2">
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
        <div className="col-md-4 mb-2">
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
        <div className="col-md-4 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
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
        <div className="col-md-4 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
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
        <div className="col-md-4 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                DiffiCulty Level
              </InputLabel>
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
        <div className="col-md-4 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Time Required
              </InputLabel>
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
        <div className="col-md-4 mb-2">
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
        <div className="col-md-4 mb-2">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Exam Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="examTemplate"
                label="Exam Group"
                value={selectedTemplate}
                onChange={handleSelectedTemplate}
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
        <hr />
        <div className="row justify-content-end">
          <div className="col-md-6 text-center">
            <div className="input-group flex-nowrap rounded border border-success">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                <b>Search</b> &nbsp; &nbsp;&nbsp;
                <i className="fa fa-search"></i>
              </span>
              <input className="form-control" type="text" name="search" />
            </div>
          </div>
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleShowQuestionTypeModal}
            >
              Add Question
            </button>
          </div>
          <div className="col-md-1">
            <div className="form-check form-switch">
              <input
                className="form-check-input border border-primary"
                type="checkbox"
                checked={editMode}
                onChange={handleChangeEditMode}
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label "
                htmlFor="flexSwitchCheckDefault"
              >
                Delete
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-check form-switch">
              <input
                className="form-check-input border border-primary"
                type="checkbox"
                checked={addToTemplate}
                onChange={handleAddToTemplate}
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label "
                htmlFor="flexSwitchCheckDefault"
              >
                Add to Template
              </label>
            </div>
          </div>
        </div>

        <Modal
          show={showQuestionTypeModal}
          onHide={handleShowQuestionTypeModal}
        >
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

        <hr className="mt-2 mb-2" />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-success ">
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
              {editMode && <TableCell>Delete</TableCell>}
              {addToTemplate && <TableCell>Add</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question, index) => (
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
                {addToTemplate && (
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
