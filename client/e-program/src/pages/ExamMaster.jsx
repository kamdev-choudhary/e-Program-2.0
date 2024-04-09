import { useState, useEffect } from "react";
import React from "react";
import { Modal, Button } from "react-bootstrap";
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
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ViewExamTemplate from "../components/ViewExamTemplate";
import CreateExamTemplate from "../components/CreateExamTemplate";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ExamMaster() {
  const [showAddExamTemplate, setShowAddExamTemplate] = useState(false);
  const [examTemplates, setExamTemplates] = useState([]);
  const [error, setError] = useState("");

  const [refresh, setRefresh] = useState(false);
  const [currTemplate, setCurrTemplate] = useState([]);
  const [showExamTemplateModal, setShowExamTemplateModal] = useState(false);
  const [batch, setBatch] = useState([]);
  const [batches, setBatches] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, []);

  const handleShowExamTemplateModal = () => {
    setShowExamTemplateModal(!showExamTemplateModal);
  };

  const handleShowExamTemplate = (examTemplate) => {
    handleShowExamTemplateModal();
    if (examTemplate) {
      setCurrTemplate(examTemplate);
    }
  };

  const handleShowAddTemplate = () => {
    setShowAddExamTemplate(!showAddExamTemplate);
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
  }, []);

  return (
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
                onChange={(e) => setSearchInput(e.target.value)}
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
          <CreateExamTemplate handleShowAddTemplate={handleShowAddTemplate} />
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
                <TableCell align="center">{examtemplate.examId}</TableCell>
                <TableCell align="center">{examtemplate.examName}</TableCell>
                <TableCell align="center">{examtemplate.createdAt}</TableCell>
                <TableCell align="center">{examtemplate.examPattern}</TableCell>
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
    </>
  );
}
