import { useState, useEffect } from "react";
import Users from "../components/Users";
import AcademicInfo from "../components/AcademicInfo";
import React from "react";
import { Modal, Button, ModalBody } from "react-bootstrap";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import ViewExamTemplate from "../components/ViewExamTemplate";

const API_URL = "http://127.0.0.1:5000/api";

export default function AdminPage() {
  const [showAddExamTemplate, setShowAddExamTemplate] = useState(false);
  const [ShowAdminContent, setShowAdminContent] = useState("dashboard");
  const [examTemplates, setExamTemplates] = useState([]);
  const [error, setError] = useState("");
  const [newExamTemplate, setNewExamTemplate] = useState({
    examName: "",
    examPattern: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [currTemplate, setCurrTemplate] = useState([]);
  const [showExamTemplateModal, setShowExamTemplateModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [batch, setBatch] = useState([]);
  const [batches, setBatches] = useState([]);

  const handleBatchInputChange = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetch(`${API_URL}/batch`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setBatches(data.batches))
      .catch((error) => setError(error.message));
  }, [refresh]);

  const handleSaveBatch = () => {
    fetch(`${API_URL}/batch/addnew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    })
      .then((response) => {
        response.json();
        if (response.ok) {
        }
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleShowAddBatch = () => {
    setShowAddBatchModal(!showAddBatchModal);
  };

  const handleShowExamTemplateModal = () => {
    setShowExamTemplateModal(!showExamTemplateModal);
  };

  const handleShowExamTemplate = (examTemplate) => {
    handleShowExamTemplateModal();
    if (examTemplate) {
      setCurrTemplate(examTemplate);
    }
  };

  const handleNewExamTemplate = (e) => {
    setNewExamTemplate({ ...newExamTemplate, [e.target.name]: e.target.value });
  };

  const handleAdminContent = (view) => {
    setShowAdminContent(view);
  };

  const handleShowAddTemplate = () => {
    setShowAddExamTemplate(!showAddExamTemplate);
  };

  const handleCreateTemplate = () => {
    fetch("http://127.0.0.1:5000/api/exams/createtemplate", {
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
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetch(`${API_URL}/exams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setExamTemplates(data.examTemplates))
      .catch((error) => setError(error.message));
  }, [refresh]);

  const style = {
    py: 0,
    width: "100%",
    maxWidth: 360,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  };

  return (
    <>
      <div className="row mt-2 ">
        <div className="col-md-3 rounded ">
          <List sx={style}>
            <ListItem onClick={() => handleAdminContent("dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <Divider component="li" />
            <ListItem onClick={() => handleAdminContent("users")}>
              <ListItemText primary="User Master" />
            </ListItem>
            <Divider component="li" />
            <ListItem onClick={() => handleAdminContent("exam")}>
              <ListItemText primary="Exam Master" />
            </ListItem>
            <Divider component="li" />
            <ListItem onClick={() => handleAdminContent("batch")}>
              <ListItemText primary="Batch Master" />
            </ListItem>
            <Divider component="li" />
            <ListItem onClick={() => handleAdminContent("academic")}>
              <ListItemText primary="Academic Master" />
            </ListItem>
            <Divider component="li" />
          </List>
        </div>
        <div className="col-md-9 border rounded p-2">
          {ShowAdminContent === "dashboard" && (
            <div>
              <p className="text-center mt-2 h4 border rounded p-2 bg-success text-white">
                Dashboard
              </p>
              <hr />
            </div>
          )}
          {ShowAdminContent === "users" && (
            <div>
              <p className="text-center mt-2 h4 border rounded p-2 bg-success text-white">
                User Control
              </p>
              <hr />
              <Users />
            </div>
          )}
          {ShowAdminContent === "academic" && (
            <div>
              <p className="text-center mt-2 h4 border rounded p-2 bg-success text-white">
                Academic Controllers
              </p>
              <hr />
              <AcademicInfo />
            </div>
          )}
          {ShowAdminContent === "batch" && (
            <div>
              <p className="text-center mt-2 h4 border rounded p-2 bg-success text-white">
                Batch Control
              </p>
              <div className="row">
                <div className="col-md-10">
                  <FormControl fullWidth sx={{ m: 1 }} size="small">
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">
                          Search <SearchIcon />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
                <div className="col-2 d-flex justify-content-center align-items-center">
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    onClick={handleShowAddBatch}
                  >
                    <AddIcon />
                  </Fab>
                </div>
              </div>
              <hr />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead className="bg bg-success ">
                    <TableRow>
                      <TableCell align="center" className="text-white">
                        SN
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Batch Name
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Batch Class
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Preparing For
                      </TableCell>

                      <TableCell align="center" className="text-white">
                        Scholar Count
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batches.map((batch, index) => (
                      <TableRow
                        key={batch._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{batch.batchName}</TableCell>
                        <TableCell align="center">{batch.batchClass}</TableCell>
                        <TableCell align="center">
                          {batch.batchStream}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          {ShowAdminContent === "exam" && (
            <>
              <div>
                <p className="text-center mt-2 h4 border p-2 bg-success text-white rounded">
                  Exam Master (Test Templates)
                </p>

                <div className="row">
                  <div className="col-md-10">
                    <FormControl fullWidth sx={{ m: 1 }} size="small">
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={
                          <InputAdornment position="start">
                            Search <SearchIcon />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>
                  <div className="col-2 d-flex justify-content-center align-items-center">
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="add"
                      onClick={handleShowAddTemplate}
                    >
                      <AddIcon />
                    </Fab>
                  </div>
                </div>
              </div>
              <Modal
                show={showAddExamTemplate}
                onHide={handleShowAddTemplate}
                dialogClassName="modal-xl"
              >
                <Modal.Header>Create Exam Template</Modal.Header>
                <Modal.Body>
                  <form>
                    <div class="form-group col-md-12 p-2">
                      <TextField
                        fullWidth
                        label="Exam Name"
                        value={newExamTemplate.examName}
                        onChange={handleNewExamTemplate}
                        id="examName"
                        name="examName"
                        style={{ marginBottom: "20px" }}
                      />
                      <div className="row">
                        <div className="col-md-6">
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Target
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="examPattern"
                                label="Exam Pattern"
                                value={newExamTemplate.examPattern}
                                onChange={handleNewExamTemplate}
                              >
                                <MenuItem value="JEE">JEE</MenuItem>
                                <MenuItem value="NEET">NEET</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </div>
                        <div className="col-md-6">
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Pattern
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="examPattern"
                                label="Pattern"
                              >
                                <MenuItem value="JEE">JEE Main</MenuItem>
                                <MenuItem value="JEE">JEE Advanced</MenuItem>
                                <MenuItem value="NEET">NEET</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </div>
                      </div>
                    </div>
                    <div className="container mb-2">
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
                            <TableRow>
                              <TableCell align="center">
                                Single Correct
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="center">
                                Multi Correct
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell align="center">Integer Type</TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  id="outlined-size-small"
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    <div className="submit-button text-center">
                      <Button onClick={handleCreateTemplate}>Create</Button>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleShowAddTemplate}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <hr />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead className="bg bg-success ">
                    <TableRow>
                      <TableCell align="center" className="text-white">
                        Exam ID
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Template Name
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Created At
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Pattern
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Details
                      </TableCell>
                      <TableCell align="center" className="text-white">
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examTemplates.map((examtemplate, index) => (
                      <TableRow
                        key={examtemplate._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          {examtemplate.examId}
                        </TableCell>
                        <TableCell align="center">
                          {examtemplate.examName}
                        </TableCell>
                        <TableCell align="center">
                          {examtemplate.createdAt}
                        </TableCell>
                        <TableCell align="center">
                          {examtemplate.examPattern}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="sm"
                            onClick={() => handleShowExamTemplate(examtemplate)}
                          >
                            View
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <DeleteRoundedIcon />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
      </div>

      {/* Modal For Show Exam Template */}
      <Modal
        show={showExamTemplateModal}
        onHide={handleShowExamTemplateModal}
        dialogClassName="modal-xl"
      >
        <Modal.Header>View Exam Template</Modal.Header>
        <Modal.Body>
          <ViewExamTemplate currTemplate={currTemplate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowExamTemplateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal For adding Batch */}
      <Modal show={showAddBatchModal} onHide={handleShowAddBatch}>
        <Modal.Header>Add Batch</Modal.Header>
        <Modal.Body>
          <TextField
            label="Batch Name"
            fullWidth
            id="batchName"
            name="batchName"
            value={batch.batchName}
            onChange={handleBatchInputChange}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Batch Class"
            fullWidth
            id="batchClass"
            name="batchClass"
            value={batch.batchClass}
            onChange={handleBatchInputChange}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Batch Stream"
            fullWidth
            id="batchStream"
            name="batchStream"
            value={batch.batchStream}
            onChange={handleBatchInputChange}
            style={{ marginBottom: "20px" }}
          />
          <Button variant="success" onClick={handleSaveBatch}>
            Save
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleShowAddBatch}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
