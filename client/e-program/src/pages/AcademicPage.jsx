import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListSubheader from "@mui/material/ListSubheader";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function AcademicPage() {
  const [academic, setAcademic] = useState({});
  const [newAcademics, setNewAcademic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState({});
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [openNestedList, setOpenNestedList] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [newsubtopic, setNewsubtopic] = useState("");
  const [showAddTopicField, setShowAddTopicField] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, [refresh]);

  const handleSaveBatch = () => {
    fetch(`${API_URL}/batch/addnew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          handleShowAddBatch();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === selectedSubject
      );
      if (selectedSubjectData) {
        const filteredTopics = selectedSubjectData.topics.filter(
          (topic) => topic.className === selectedClass
        );
        setFilteredTopics(filteredTopics);
        setOpenNestedList(new Array(filteredTopics.length).fill(false));
      }
    }
  }, [academic.subjects, selectedSubject, selectedClass]);

  const handleAddNewTopic = () => {
    const data = {
      selectedClass: selectedClass,
      selectedSubject: selectedSubject,
      newTopic: newTopic,
    };

    fetch(`${API_URL}/academic/update/topic`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics.flatMap(
        (topic) => topic.subtopics
      );
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics]);

  const handleTopicClick = (index) => {
    setOpenNestedList((prevOpenNestedList) => {
      const newOpenNestedList = [...prevOpenNestedList];
      newOpenNestedList[index] = !newOpenNestedList[index];
      return newOpenNestedList;
    });
  };

  const handleShowAddBatch = () => {
    setShowAddBatchModal(!showAddBatchModal);
  };

  return (
    <>
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Batches
          </AccordionSummary>
          <>
            <Paper elevation={4} sx={{ padding: "10px" }}>
              <div className="row">
                <div className="col-md-11">
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
                <div className="col-md-1 d-flex justify-content-center align-items-center">
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
                        <TableCell align="center">
                          {batch.scholars.length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Classes
          </AccordionSummary>
          {academic &&
            academic.classes &&
            academic.classes.map((className, index) => (
              <AccordionDetails key={index}>{className}</AccordionDetails>
            ))}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Targets
          </AccordionSummary>
          {academic &&
            academic.target &&
            academic.target.map((tget, index) => (
              <AccordionDetails key={index}>{tget}</AccordionDetails>
            ))}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Difficulty Level
          </AccordionSummary>
          {academic &&
            academic.difficultyLevel &&
            academic.difficultyLevel.map((dLevel, index) => (
              <AccordionDetails key={index}>{dLevel}</AccordionDetails>
            ))}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Time Required
          </AccordionSummary>
          {academic &&
            academic.timeRequired &&
            academic.timeRequired.map((time, index) => (
              <AccordionDetails key={index}>{time}</AccordionDetails>
            ))}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Subject Details
          </AccordionSummary>
          <div className="row p-2">
            <div className="col-md-4 mb-3">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Class</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="classes"
                    label="Class"
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                  >
                    {academic &&
                      academic.classes &&
                      academic.classes.map((className, index) => (
                        <MenuItem key={index} value={className}>
                          {className}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="col-md-4 mb-2">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="subject"
                    label="Subject"
                    value={selectedSubject}
                    onChange={(event) => setSelectedSubject(event.target.value)}
                  >
                    {academic &&
                      academic.subjects &&
                      academic.subjects.map((subject, index) => (
                        <MenuItem key={index} value={subject.name}>
                          {subject.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>

            {selectedSubject && (
              <>
                <div className="col-md-3">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowAddTopicField(true)}
                  >
                    Add new topic
                  </Button>
                </div>
                <React.Fragment>
                  <Dialog
                    open={showAddTopicField}
                    onClose={() => setShowAddTopicField(false)}
                  >
                    <DialogContent>
                      <Box sx={{ padding: 2 }}>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ marginBottom: 2 }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Class
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="classes"
                            label="Class"
                            value={selectedClass}
                            onChange={(event) =>
                              setSelectedClass(event.target.value)
                            }
                          >
                            {academic &&
                              academic.classes &&
                              academic.classes.map((className, index) => (
                                <MenuItem key={index} value={className}>
                                  {className}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ marginBottom: 2 }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Subject
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="subject"
                            label="Subject"
                            value={selectedSubject}
                            onChange={(event) =>
                              setSelectedSubject(event.target.value)
                            }
                          >
                            {academic &&
                              academic.subjects &&
                              academic.subjects.map((subject, index) => (
                                <MenuItem key={index} value={subject.name}>
                                  {subject.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        <hr />
                        <FormControl fullWidth size="small">
                          <TextField
                            variant="standard"
                            label="New Topic"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            fullWidth
                          />
                        </FormControl>
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowAddTopicField(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddNewTopic}>Save</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              </>
            )}
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Topics & Subtopics
                </ListSubheader>
              }
            >
              {filteredTopics &&
                filteredTopics.map((topic, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      onClick={() => {
                        handleTopicClick(index);
                        setSelectedTopic(topic);
                      }}
                    >
                      <ListItemText primary={`${index + 1} ${topic.name}`} />
                      {openNestedList[index] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse
                      in={openNestedList[index]}
                      timeout="auto"
                      unmountOnExit
                    >
                      {selectedTopic &&
                        selectedTopic.subtopics &&
                        selectedTopic.subtopics.map((subtopic, index) => (
                          <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                              <ListItemText
                                key={index}
                                primary={subtopic.name}
                              />
                            </ListItemButton>
                          </List>
                        ))}
                    </Collapse>
                  </React.Fragment>
                ))}
            </List>
          </div>
        </Accordion>
      </div>
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
            style={{ marginBottom: "10px" }}
          />
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="batchClass"
              name="batchClass"
              label="Class"
              value={batch.batchClass || ""}
              onChange={handleBatchInputChange}
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
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="demo-simple-select-label">
              Target or Stream
            </InputLabel>
            <Select
              id="batchStream"
              name="batchStream"
              label="Target or Stream"
              value={batch.batchStream || ""}
              onChange={handleBatchInputChange}
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

          <Button variant="contained" color="success" onClick={handleSaveBatch}>
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
