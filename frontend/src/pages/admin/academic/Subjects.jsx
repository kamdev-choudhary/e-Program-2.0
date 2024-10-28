import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid2";
import Class from "./Class";
import { useGlobalProvider } from "../../../GlobalProvider";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Divider,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { AddRounded, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "../../../constants/helper";
import { CustomModal } from "../../../components/CustomModal";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import CustomDropDown from "../../../components/CustomDropDown";

function AcademicInfo() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [subSubjects, setSubSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedSubSubject, setSelectedSubSubject] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [selectedsubTopic, setSelectedsubTopic] = useState([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddSubSubject, setShowAddSubSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);
  const [showEditSubject, setShowEditSubject] = useState(false);
  const [showEditSubSubject, setShowEditSubSubject] = useState(false);
  const [showEditTopic, setShowEditTopic] = useState(false);
  const [showEditSubTopic, setShowEditSubTopic] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newSubSubject, setNewSubSubject] = useState("");
  const [newTopic, setNewTopic] = useState();
  const [newSubTopic, setNewSubTopic] = useState();

  const filteredSubSubjects = useMemo(() => {
    if (!selectedSubject || Object.keys(selectedSubject).length === 0) {
      return subSubjects; //
    }
    return subSubjects?.filter(
      (ss) => !selectedSubject || ss.id_subject === selectedSubject.id_subject
    );
  }, [subSubjects, selectedSubject]);

  const filteredTopics = useMemo(() => {
    if (!topics) return [];

    return topics.filter((t) => {
      const subjectMatch =
        !selectedSubject || t.id_subject === selectedSubject.id_subject;
      const subSubjectMatch =
        !selectedSubSubject ||
        t.id_sub_subject === selectedSubSubject.id_sub_subject;

      return subjectMatch || subSubjectMatch;
    });
  }, [topics, selectedSubject, selectedSubSubject]);

  const filteredSubTopics = useMemo(() => {
    if (!subTopics) return [];
    return subTopics?.filter((s) => {
      const subjectMatch =
        !selectedSubject || s.id_subject === selectedSubject.id_subject;
      const subSubjectMatch =
        !selectedSubSubject ||
        s.id_sub_subject === selectedSubSubject.id_sub_subject;
      const topicMatch =
        !selectedTopic || s.id_topic === selectedTopic.id_topic;
      return subjectMatch || subSubjectMatch || topicMatch;
    });
  }, [subTopics, selectedSubject, selectedSubSubject, selectedTopic]);

  const getData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const subjectResponse = await axios.get(`${API_URL}/academic/subject`);
      if (isValidResponse(subjectResponse)) {
        setSubjects(subjectResponse?.data?.subjects);
      }
      const subSubjectResponse = await axios.get(
        `${API_URL}/academic/sub-subject`
      );
      if (isValidResponse(subSubjectResponse)) {
        setSubSubjects(subSubjectResponse?.data?.subSubjects);
      }
      const topicResponse = await axios.get(`${API_URL}/academic/topic`);
      if (isValidResponse(topicResponse)) {
        setTopics(topicResponse?.data?.topics);
      }
      const subTopicResponse = await axios.get(`${API_URL}/academic/sub-topic`);
      if (isValidResponse(subTopicResponse)) {
        setSubTopics(subTopicResponse?.data?.subTopics);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setShowEditSubject(true);
  };

  const handleDeleteSubject = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${API_URL}/academic/subject/${id}`
          );
          if (isValidResponse(response)) {
            setSubjects(response.data.subjects);
            setSubSubjects(response?.data?.subSubjects);
            setTopics(response?.data?.topics);
            setSubTopics(response?.data?.subTopics);
            Swal.fire({
              title: "Deleted!",
              text: "Deleted Successfully.",
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveSubjectEdit = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      if (!selectedSubject.name) {
        setError("Subject name is required.");
        setSnackbarOpen(true);
        return;
      }
      const response = await axios.patch(
        `${API_URL}/academic/subject/${selectedSubject?._id}`,
        {
          ...selectedSubject,
        }
      );
      setSubjects(response?.data?.subjects);
      setShowEditSubject(false);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSaveSubject = async () => {
    try {
      if (!newSubject) {
        return setError("Name is required.");
      }
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/academic/subject`, {
        name: newSubject,
      });
      setSubjects(response?.data?.subjects);
      setShowAddSubject(false);
      setNewSubject("");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSaveSubSubject = async () => {
    try {
      if (!newSubSubject || !selectedSubject) {
        return setError("Both Subject and Name are required.");
      }
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/academic/sub-subject`, {
        name: newSubSubject,
        _id_subject: selectedSubject?._id,
      });
      isValidResponse(response);
      setSubSubjects(response.data.subSubjects);
      setShowAddSubSubject(false);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleDeleteSubSubject = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${API_URL}/academic/sub-subject/${id}`
          );
          isValidResponse(response);
          setSubSubjects(response.data.subSubjects);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSaveTopic = async () => {
    try {
      const response = await axios.post(`${API_URL}/academic/topic`, {
        name: newTopic,
        _id_subject: selectedSubject?._id,
        _id_sub_subject: selectedSubSubject?._id,
      });
      isValidResponse(response);
      setTopics(response.data?.topics);
      setShowAddTopic(false);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSaveSubTopic = async () => {
    try {
      const response = await axios.post(`${API_URL}/academic/sub-topic`, {
        name: newSubTopic,
        _id_subject: selectedSubject?._id,
        _id_sub_subject: selectedSubSubject?._id,
        _id_topic: selectedTopic?._id,
      });
      isValidResponse(response);
      setSubTopics(response.data.subTopics);
      setShowAddSubTopic(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleEditSubSubject = () => {};

  const handleEditTopic = () => {};

  const handleEditSubTopic = () => {};

  const handleDeleteSubTopic = (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${API_URL}/academic/sub-topic/${id}`
          );
          isValidResponse(response);
          setSelectedsubTopic(response.data.subTopics);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box component={Paper} sx={{ borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: "#28844f",
              }}
            >
              <Typography
                sx={{
                  ml: 1,
                  color: "#fff",
                }}
                variant="h6"
              >
                Subjects
              </Typography>
              <IconButton
                variant="contained"
                onClick={() => setShowAddSubject(true)}
              >
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            <Divider />
            <List sx={{ height: 350, overflow: "auto" }}>
              {subjects.map((subject, index) => (
                <ListItem
                  sx={{
                    bgcolor:
                      selectedSubject?._id === subject?._id ? "#914D7E" : "",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedSubject(subject)}
                  key={index}
                >
                  <Typography
                    sx={{
                      color:
                        selectedSubject?._id === subject?._id ? "#fff" : "",
                    }}
                  >
                    {subject.name}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEditSubject(subject)}>
                      <Edit
                        sx={{
                          color:
                            selectedSubject?._id === subject?._id ? "#fff" : "",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSubject(subject?._id)}
                    >
                      <Delete
                        sx={{
                          color:
                            selectedSubject?._id === subject?._id ? "#fff" : "",
                        }}
                      />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box component={Paper}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: "#28844f",
              }}
            >
              <Typography sx={{ ml: 1, color: "#fff" }} variant="h6">
                Sub Subjects
              </Typography>
              <IconButton
                variant="contained"
                onClick={() => setShowAddSubSubject(true)}
              >
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            <Divider />
            <List sx={{ height: 350, overflow: "auto" }}>
              {filteredSubSubjects?.map((subSubject, index) => (
                <ListItem
                  sx={{
                    bgcolor:
                      selectedSubSubject?._id === subSubject?._id
                        ? "#914D7E"
                        : "",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  key={index}
                  onClick={() => setSelectedSubSubject(subSubject)}
                >
                  <Typography
                    sx={{
                      color:
                        selectedSubSubject?._id === subSubject?._id
                          ? "#fff"
                          : "",
                    }}
                  >
                    {subSubject.name}
                  </Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleEditSubSubject(subSubject)}
                    >
                      <Edit
                        sx={{
                          color:
                            selectedSubSubject?._id === subSubject?._id
                              ? "#fff"
                              : "",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSubSubject(subSubject?._id)}
                    >
                      <Delete
                        sx={{
                          color:
                            selectedSubSubject?._id === subSubject?._id
                              ? "#fff"
                              : "",
                        }}
                      />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box component={Paper}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: "#28844f",
              }}
            >
              <Typography sx={{ ml: 1, color: "#fff" }} variant="h6">
                Topics
              </Typography>
              <IconButton
                variant="contained"
                onClick={() => setShowAddTopic(true)}
              >
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            <Divider />
            <List sx={{ height: 350, overflow: "auto" }}>
              {filteredTopics?.map((topic, index) => (
                <ListItem
                  onClick={() => setSelectedTopic(topic)}
                  key={index}
                  sx={{
                    justifyContent: "space-between",
                    bgcolor: selectedTopic?._id === topic._id ? "#914D7e" : "",
                  }}
                >
                  <Typography
                    sx={{
                      color: selectedTopic?._id === topic._id ? "#fff" : "",
                    }}
                  >
                    {topic.name}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEditTopic(topic)}>
                      <Edit
                        sx={{
                          color: selectedTopic?._id === topic._id ? "#fff" : "",
                        }}
                      />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTopic(topic?._id)}>
                      <Delete
                        sx={{
                          color: selectedTopic?._id === topic._id ? "#fff" : "",
                        }}
                      />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box component={Paper}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: "#28844f",
              }}
            >
              <Typography sx={{ ml: 1, color: "#fff" }} variant="h6">
                Sub Topics
              </Typography>
              <IconButton
                variant="contained"
                onClick={() => setShowAddSubTopic(true)}
              >
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            <Divider />
            <List sx={{ height: 350, overflow: "auto" }}>
              {filteredSubTopics?.map((subTopic, index) => (
                <ListItem
                  onClick={() => setSelectedsubTopic(subTopic)}
                  key={index}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography
                    sx={{
                      color:
                        selectedsubTopic?._id === subTopic?._id
                          ? "#914D7E"
                          : "",
                    }}
                  >
                    {subTopic.name}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEditSubTopic(subTopic)}>
                      <Edit
                        sx={{
                          color:
                            selectedsubTopic?._id === subTopic?._id
                              ? "#fff"
                              : "",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSubTopic(subTopic?._id)}
                    >
                      <Delete
                        sx={{
                          color:
                            selectedsubTopic?._id === subTopic?._id
                              ? "#fff"
                              : "",
                        }}
                      />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      {/* Add Subject */}
      <CustomModal
        open={showAddSubject}
        onClose={() => setShowAddSubject(false)}
        height="auto"
        width="auto"
        header="Add Subject"
      >
        <Box sx={{ minWidth: 350, display: "grid", rowGap: 2 }}>
          <TextField
            size="small"
            fullWidth
            label="Subject"
            value={newSubject}
            onChange={(e) => {
              setNewSubject(e.target.value);
              setError("");
            }}
            error={error && !newSubject}
            helperText={error}
          />
          <Button onClick={handleSaveSubject} fullWidth variant="contained">
            Save
          </Button>
        </Box>
      </CustomModal>

      {/* Add Sub Subject */}
      <CustomModal
        open={showAddSubSubject}
        onClose={() => setShowAddSubSubject(false)}
        height="auto"
        width="auto"
        header="Add Sub Subject"
      >
        <Box sx={{ minWidth: 350, display: "grid", rowGap: 2 }}>
          <CustomDropDown
            data={subjects}
            value={selectedSubject?._id || ""}
            name="name"
            label="Subject"
            onChange={(e) => {
              const selectedId = e.target.value;
              const foundSubject = subjects?.find((s) => s._id === selectedId);
              setSelectedSubject(foundSubject || null); // Set to null if not found
            }}
            dropdownValue="_id"
          />

          <TextField
            size="small"
            fullWidth
            label="Sub Subject Name"
            value={newSubSubject}
            onChange={(e) => {
              setNewSubSubject(e.target.value);
              setError("");
            }}
            error={error && !newSubSubject}
            helperText={error}
          />
          <Button onClick={handleSaveSubSubject} fullWidth variant="contained">
            Save
          </Button>
        </Box>
      </CustomModal>

      {/* Add Topic Subject */}
      <CustomModal
        open={showAddTopic}
        onClose={() => setShowAddTopic(false)}
        height="auto"
        width="auto"
        header="Add Topic"
      >
        <Box sx={{ minWidth: 350, display: "grid", rowGap: 2 }}>
          <CustomDropDown
            data={subjects}
            label="Subject"
            value={selectedSubject?._id}
            name="name"
            onChange={(e) => {
              setSelectedSubject(() =>
                subjects?.find((s) => s?._id === e.target.value)
              );
            }}
            dropdownValue="_id"
          />
          <CustomDropDown
            data={filteredSubSubjects}
            label="Sub Subject"
            value={selectedSubSubject._id}
            name="name"
            onChange={(e) => {
              setSelectedSubSubject(() =>
                subSubjects?.find((s) => s._id === e.target.value)
              );
            }}
            dropdownValue="_id"
          />
          <TextField
            size="small"
            fullWidth
            label="Topic"
            value={newTopic}
            onChange={(e) => {
              setNewTopic(e.target.value);
              setError("");
            }}
            error={error && !newTopic}
            helperText={error}
          />
          <Button onClick={handleSaveTopic} fullWidth variant="contained">
            Save
          </Button>
        </Box>
      </CustomModal>

      {/* Add Topic Subject */}
      <CustomModal
        open={showAddSubTopic}
        onClose={() => setShowAddSubTopic(false)}
        height="auto"
        width="auto"
        header="Add Sub Topic"
      >
        <Box sx={{ minWidth: 350, display: "grid", rowGap: 2 }}>
          <CustomDropDown
            data={subjects}
            label="Subject"
            value={selectedSubject?._id}
            name="name"
            onChange={(e) => {
              setSelectedSubject(() =>
                subjects?.find((s) => s?._id === e.target.value)
              );
            }}
            dropdownValue="_id"
          />
          <CustomDropDown
            data={filteredSubSubjects}
            label="Sub Subject"
            value={selectedSubSubject._id}
            name="name"
            onChange={(e) => {
              setSelectedSubSubject(() =>
                subSubjects?.find((s) => s._id === e.target.value)
              );
            }}
            dropdownValue="_id"
          />
          <CustomDropDown
            data={filteredTopics}
            label="Topic"
            value={selectedTopic._id}
            name="name"
            onChange={(e) => {
              setSelectedTopic(() =>
                topics?.find((s) => s._id === e.target.value)
              );
            }}
            dropdownValue="_id"
          />
          <TextField
            size="small"
            fullWidth
            label="Sub Topic Name"
            value={newSubTopic}
            onChange={(e) => {
              setNewSubTopic(e.target.value);
              setError("");
            }}
            error={error && !newTopic}
            helperText={error}
          />
          <Button onClick={handleSaveSubTopic} fullWidth variant="contained">
            Save
          </Button>
        </Box>
      </CustomModal>

      {/* Edit Subject */}
      <CustomModal
        open={showEditSubject}
        onClose={() => setShowEditSubject(false)}
        height="auto"
        width="auto"
        header="Add Subject"
      >
        <Box sx={{ minWidth: 350, display: "grid", rowGap: 2 }}>
          <TextField
            size="small"
            fullWidth
            label="Subject"
            value={selectedSubject.name}
            onChange={(e) => {
              setSelectedSubject({ ...selectedSubject, name: e.target.value });
              setError("");
            }}
            error={error && !selectedSubject.name}
            helperText={error}
          />
          <Button onClick={handleSaveSubjectEdit} fullWidth variant="contained">
            Save
          </Button>
        </Box>
      </CustomModal>
    </div>
  );
}

export default AcademicInfo;
