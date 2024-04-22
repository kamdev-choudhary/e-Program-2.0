import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import ConfirmationDialog from "../../components/ConfirmationDialog";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  List,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  ListItemText,
  ListItemButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function AcademicPage() {
  const [academic, setAcademic] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newAcademics, setNewAcademic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState({});
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [newsubtopic, setNewsubtopic] = useState("");
  const [showAddTopicField, setShowAddTopicField] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showAddSubtopicField, setShowAddSubtopicField] = useState(false);
  const [selectedTopicName, setSelectedTopicName] = useState("");

  const [showDeleteTopicDialog, setShowDeleteTopicDialog] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
        setIsLoading(false);
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
        setShowAddTopicField(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleAddNewSubtopic = () => {
    const data = {
      selectedClass: selectedClass,
      selectedSubject: selectedSubject,
      selectedTopic: selectedTopicName,
      subtopic: newsubtopic,
    };
    console.log(data);
    fetch(`${API_URL}/academic/update/subtopic`, {
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
        setShowAddSubtopicField(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handdleDeleteSubtopic = (subtopic) => {
    console.log(selectedTopic);
    const data = {
      className: selectedClass,
      name: selectedSubject,
      topicId: selectedTopic._id,
      subtopicId: subtopic._id,
    };

    const subtopicToDelete = subtopic._id;
    console.log(
      selectedTopic.subtopics.filter(
        (subtopic) => subtopic._id !== subtopicToDelete
      )
    );

    fetch(`${API_URL}/academic/deletesubtopic`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setSelectedTopic((prevTopic) => ({
          ...prevTopic,
          subtopics: prevTopic.subtopics.filter(
            (subtopic) => subtopic._id !== subtopicToDelete
          ),
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteTopic = (topic) => {
    setTopicToDelete(topic);
    setShowDeleteTopicDialog(true);
  };

  const handleConfirmDeleteTopic = () => {
    console.log(topicToDelete);
    const data = {
      className: topicToDelete.className,
      name: selectedSubject,
      topicId: topicToDelete._id,
    };
    const deletedTopic = topicToDelete._id;
    fetch(`${API_URL}/academic/deletetopic`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setFilteredTopics((prevTopics) =>
          prevTopics.filter((topic) => topic._id !== deletedTopic)
        );
        setSelectedTopic({});
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setShowDeleteTopicDialog(false);
  };

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics.flatMap(
        (topic) => topic.subtopics
      );
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics]);

  const handleShowAddBatch = () => {
    setShowAddBatchModal(!showAddBatchModal);
  };

  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item sx={12} lg={12}>
            <Box fullWidth>
              <Skeleton
                sx={{ borderRadius: 2 }}
                variant="rectangular"
                height={400}
              />
            </Box>
          </Grid>
          <Grid item sx={12} lg={12}>
            <Box fullWidth>
              <Skeleton
                sx={{ borderRadius: 2 }}
                variant="rectangular"
                height={400}
              />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Paper elevation={6} sx={{ padding: 1, marginTop: 1, marginBottom: 1 }}>
        <Box sx={{ marginLeft: 2, marginRight: 2, marginTop: 1 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Subject Details
          </Typography>
          <hr />
        </Box>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
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
            </Grid>
            <Grid item xs={12} lg={4}>
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
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={6}>
              <Box
                sx={{
                  width: "100%",
                  // maxWidth: 360,
                  bgcolor: "#EEE",
                  padding: 2,
                  borderRadius: 3,
                }}
              >
                <Box>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={4} lg={4}>
                      <Typography>Topics</Typography>
                    </Grid>
                    <Grid item xs={8} lg={8}>
                      <Grid container justifyContent="flex-end">
                        {selectedSubject && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ borderRadius: 10 }}
                            onClick={() => setShowAddTopicField(true)}
                          >
                            Add new topic
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                <>
                  <Dialog
                    open={showAddTopicField}
                    onClose={() => setShowAddTopicField(false)}
                  >
                    <DialogContent>
                      <Box sx={{ padding: 1, maxWidth: 400 }}>
                        <Typography variant="h5">Add Topic</Typography>
                        <hr />
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
                        <FormControl fullWidth>
                          <TextField
                            label="New Topic Name"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            fullWidth
                            size="small"
                          />
                        </FormControl>
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 10 }}
                        onClick={() => setShowAddTopicField(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 10 }}
                        onClick={handleAddNewTopic}
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>

                <List>
                  {filteredTopics &&
                    filteredTopics.map((topic, index) => (
                      <ListItemButton
                        key={index}
                        selected={selectedTopic.name === topic.name}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setSelectedTopicName(topic.name);
                        }}
                      >
                        <ListItemText primary={`${index + 1}. ${topic.name}`} />
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteTopic(topic)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                    ))}
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <Box
                sx={{
                  width: "100%",
                  // maxWidth: 360,
                  bgcolor: "#EEE",
                  padding: 2,
                  borderRadius: 3,
                }}
              >
                <Grid
                  container
                  alignItems="baseline"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Grid item xs={6}>
                    <Typography>Sub Topics</Typography>
                  </Grid>
                  <Grid item justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ borderRadius: 10 }}
                      onClick={() => setShowAddSubtopicField(true)}
                    >
                      Add Subtopics
                    </Button>
                  </Grid>
                </Grid>
                <List>
                  {selectedTopic &&
                    selectedTopic.subtopics &&
                    selectedTopic.subtopics.map((subtopic, index) => (
                      <ListItemButton key={index}>
                        <ListItemText
                          primary={`${index + 1}. ${subtopic.name}`}
                        />
                        <IconButton
                          aria-label="delete"
                          onClick={() => handdleDeleteSubtopic(subtopic)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                    ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <br />
      <Paper elevation={6} sx={{ padding: 1 }}>
        <Box sx={{ marginLeft: 2, marginRight: 1, marginTop: 1 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Batches
          </Typography>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Grid container gap={2}>
            <Grid item xs={12} lg={8}>
              <FormControl fullWidth size="small">
                <OutlinedInput
                  id="outlined-adornment-amount"
                  sx={{ borderRadius: 10 }}
                  startAdornment={
                    <InputAdornment position="start">
                      Search <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Button
                variant="contained"
                onClick={handleShowAddBatch}
                sx={{ borderRadius: 10 }}
              >
                Add New Topic
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ padding: 2 }}>
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
                    <TableCell align="center">{batch.batchStream}</TableCell>
                    <TableCell align="center">
                      {batch.scholars.length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <React.Fragment>
        <Dialog
          open={showAddSubtopicField}
          onClose={() => setShowAddSubtopicField(false)}
        >
          <DialogContent>
            <Box sx={{ padding: 1, maxWidth: 400 }}>
              <Typography variant="h5">Add New Subtopic</Typography>
              <hr />
              <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
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
              <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
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
              <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="topic"
                  label="Topic"
                  value={selectedTopicName}
                  onChange={(event) => setSelectedTopicName(event.target.value)}
                >
                  {filteredTopics &&
                    filteredTopics.map((topic, index) => (
                      <MenuItem key={index} value={topic.name}>
                        {topic.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="New Subtopic Name"
                  value={newsubtopic}
                  onChange={(e) => setNewsubtopic(e.target.value)}
                  fullWidth
                  size="small"
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              sx={{ borderRadius: 10 }}
              onClick={() => setShowAddSubtopicField(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ borderRadius: 10 }}
              onClick={handleAddNewSubtopic}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
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
      <ConfirmationDialog
        open={showDeleteTopicDialog}
        handleClose={() => setShowDeleteTopicDialog(false)}
        handleConfirm={handleConfirmDeleteTopic}
        message={`Are you sure you want to delete the topic ?`}
      />
    </>
  );
}
