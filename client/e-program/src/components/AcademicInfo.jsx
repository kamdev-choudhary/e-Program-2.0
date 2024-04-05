import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const API_URL = "http://127.0.0.1:5000/api";

export default function AcademicInfo() {
  const [academic, setAcademic] = useState({});
  const [classData, setClassData] = useState([]);
  const [updateAcademic, setUpdateAcademic] = useState({});
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [subtopicName, setSubtopicName] = useState("");
  const [errors, setErrors] = useState({
    classes: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, []);

  console.log(academic);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [newAcademicData, setNewAcademicData] = useState({
    subject: "",
  });

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === selectedSubject
      );
      const filteredTopics = selectedSubjectData.topics.filter(
        (topic) => topic.className === selectedClass
      );
      setFilteredTopics(filteredTopics);
    }
  }, [selectedClass, selectedSubject, academic.subjects]);

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics.flatMap(
        (topic) => topic.subtopics
      );
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics]);

  const handleUpdateAcademicData = () => {
    fetch(`${API_URL}/academic`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAcademicData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data updated successfully", data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleSelectedSubject = (subject) => {
    setSelectedSubject(subject);
  };

  console.log(selectedSubject);

  const style = {
    py: 0,
    width: "100%",
    maxWidth: 360,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newSubtopic = { name: subtopicName };
      const newTopic = { className, name: topicName, subtopics: [newSubtopic] };
      const newSubject = { name: subjectName, topics: [newTopic] };
      console.log(newSubject);
      fetch(`${API_URL}/academic/update2`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data updated successfully", data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });

      console.log("New data added successfully");
    } catch (error) {
      console.error("Error adding new data:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Topic Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtopic Name"
          value={subtopicName}
          onChange={(e) => setSubtopicName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 300,
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Classes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {academic &&
                academic.classes &&
                academic.classes.map((className, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{className}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 300,
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Target
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {academic &&
                academic.target &&
                academic.target.map((tget, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{tget}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 300,
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Time Required
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {academic &&
                academic.timeRequired &&
                academic.timeRequired.map((time, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{time}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 300,
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Difficulty Level
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {academic &&
                academic.difficultyLevel &&
                academic.difficultyLevel.map((dLevel, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{dLevel}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <List sx={style}>
        {academic &&
          academic.subjects &&
          academic.subjects.map((subject, index) => (
            <>
              <ListItem onClick={() => handleSelectedSubject(subject)}>
                <ListItemText primary={subject.name} />
              </ListItem>
              <Divider component="li" />
            </>
          ))}
      </List>
    </>
  );
}
