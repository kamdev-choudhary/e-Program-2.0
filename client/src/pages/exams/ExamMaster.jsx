import { useState, useEffect } from "react";
import React from "react";
import { Modal } from "react-bootstrap";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ViewExamTemplate from "../../components/ViewExamTemplate";
import CreateExamTemplate from "../../components/CreateExamTemplate";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CreateExamTemplateOffline from "../../components/CreateExamTemplateOffline";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ExamMaster() {
  const [showAddExamTemplate, setShowAddExamTemplate] = useState(false);
  const [examTemplates, setExamTemplates] = useState([]);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState("online");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [currTemplate, setCurrTemplate] = useState([]);
  const [showExamTemplateModal, setShowExamTemplateModal] = useState(false);
  const [batch, setBatch] = useState([]);
  const [batches, setBatches] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showAddOfflineExamTemplate, setShowAddOfflineExamTemplate] =
    useState(false);

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
      .then((data) => {
        setExamTemplates(data.examTemplates);
        setIsLoading(false);
      })
      .catch((error) => setError(error.message));
  }, []);

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
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(event, newValue) => setTabValue(newValue)}>
            <Tab label="Online Exams" value="online" />
            <Tab label="Offline Exams" value="offline" />
          </TabList>
        </Box>
        <TabPanel value="online">
          <>
            <Grid container spacing={2}>
              <Grid item sx={6} md={6} lg={8}>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    sx={{ borderRadius: 10 }}
                    onChange={(e) => setSearchInput(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        Search <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item sx={6} md={6} lg={4}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 10 }}
                  onClick={handleShowAddTemplate}
                >
                  Create New Template
                </Button>
              </Grid>
              <Grid item></Grid>
              <Grid item sx={12} lg={12} md={12}>
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
                              onClick={() =>
                                handleShowExamTemplate(examtemplate)
                              }
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
              </Grid>
            </Grid>
            <Modal
              show={showAddExamTemplate}
              onHide={handleShowAddTemplate}
              dialogClassName="modal-xl"
            >
              <Modal.Header>Create Exam Template</Modal.Header>
              <Modal.Body>
                <CreateExamTemplate
                  handleShowAddTemplate={handleShowAddTemplate}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleShowAddTemplate}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

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
        </TabPanel>
        <TabPanel value="offline">
          <>
            <Grid container spacing={2}>
              <Grid item sx={6} md={6} lg={8}>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    sx={{ borderRadius: 10 }}
                    onChange={(e) => setSearchInput(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        Search <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item sx={6} md={6} lg={4}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 10 }}
                  onClick={handleShowAddTemplate}
                >
                  Create New Template
                </Button>
              </Grid>
              <Grid item></Grid>
              <Grid item sx={12} lg={12} md={12}>
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
                              onClick={() =>
                                handleShowExamTemplate(examtemplate)
                              }
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
              </Grid>
            </Grid>
            <Modal
              show={showAddExamTemplate}
              onHide={handleShowAddTemplate}
              dialogClassName="modal-xl"
            >
              <Modal.Header>Create Exam Template</Modal.Header>
              <Modal.Body>
                <CreateExamTemplate
                  handleShowAddTemplate={handleShowAddTemplate}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleShowAddTemplate}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

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
          {/* Create Exam Templates Modal */}
          <Modal
            show={showAddOfflineExamTemplate}
            onHide={() => setShowAddOfflineExamTemplate(false)}
            dialogClassName="modal-xl"
          >
            <Modal.Header>Create Offline Exam Template</Modal.Header>
            <Modal.Body>
              <CreateExamTemplateOffline />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: 10 }}
                onClick={() => setShowAddOfflineExamTemplate(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
