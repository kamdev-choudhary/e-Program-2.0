import React from "react";
import { useState, useEffect } from "react";
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
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function AcademicInfo() {
  const [academic, setAcademic] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [filterData, setFilterData] = useState({
    classes: "",
    subject: "",
    topic: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, []);

  const handleFilterDataChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const style = {
    py: 0,
    width: "100%",
    maxWidth: 360,
    borderRadius: 2,
    border: "2px solid",
    borderColor: "divider",
    backgroundColor: "#0000",
  };

  const [openNestedList, setOpenNestedList] = useState(
    new Array(filteredTopics.length).fill(false)
  );

  const handleTopicClick = (index) => {
    setOpenNestedList((prevOpenNestedList) => {
      const newOpenNestedList = [...prevOpenNestedList];
      newOpenNestedList[index] = !newOpenNestedList[index];
      return newOpenNestedList;
    });
  };

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
      const filteredSubtopics = filteredTopics
        .filter((topic) => !selectedTopic || topic.name === selectedTopic)
        .flatMap((topic) => topic.subtopics);
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics, selectedTopic]);

  // console.log(selectedTopic);
  // console.log(filteredSubtopics);

  return (
    <>
      <div>
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
              <div className="col-md-3">
                <Button variant="contained" color="primary">
                  Add new topic
                </Button>
              </div>
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
    </>
  );
}

// export default function AcademicInfo() {
//   const [academic, setAcademic] = useState({});
//   const [classData, setClassData] = useState([]);
//   const [updateAcademic, setUpdateAcademic] = useState({});
//   const [filteredTopics, setFilteredTopics] = useState([]);
//   const [filteredSubtopics, setFilteredSubtopics] = useState([]);
//   const [className, setClassName] = useState("");
//   const [subjectName, setSubjectName] = useState("");
//   const [topicName, setTopicName] = useState("");
//   const [subtopicName, setSubtopicName] = useState("");
//   const [errors, setErrors] = useState({
//     classes: "",
//   });

//   useEffect(() => {
//     fetch(`${API_URL}/academic`)
//       .then((response) => response.json())
//       .then((data) => {
//         setAcademic(data.academic[0]);
//       });
//   }, []);

//   console.log(academic);

//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [newAcademicData, setNewAcademicData] = useState({
//     subject: "",
//   });

//   useEffect(() => {
//     if (selectedClass && selectedSubject) {
//       const selectedSubjectData = academic.subjects.find(
//         (subject) => subject.name === selectedSubject
//       );
//       const filteredTopics = selectedSubjectData.topics.filter(
//         (topic) => topic.className === selectedClass
//       );
//       setFilteredTopics(filteredTopics);
//     }
//   }, [selectedClass, selectedSubject, academic.subjects]);

//   useEffect(() => {
//     if (filteredTopics.length > 0) {
//       const filteredSubtopics = filteredTopics.flatMap(
//         (topic) => topic.subtopics
//       );
//       setFilteredSubtopics(filteredSubtopics);
//     }
//   }, [filteredTopics]);

//   const handleUpdateAcademicData = () => {
//     fetch(`${API_URL}/academic`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newAcademicData),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Data updated successfully", data);
//       })
//       .catch((error) => {
//         console.error("Error updating data:", error);
//       });
//   };

//   console.log(selectedSubject);

//   const style = {
//     py: 0,
//     width: "100%",
//     maxWidth: 360,
//     borderRadius: 2,
//     border: "1px solid",
//     borderColor: "divider",
//     backgroundColor: "background.paper",
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const newSubtopic = { name: subtopicName };
//       const newTopic = { className, name: topicName, subtopics: [newSubtopic] };
//       const newSubject = { name: subjectName, topics: [newTopic] };
//       console.log(newSubject);
//       fetch(`${API_URL}/academic/update2`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newSubject),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Data updated successfully", data);
//         })
//         .catch((error) => {
//           console.error("Error updating data:", error);
//         });

//       console.log("New data added successfully");
//     } catch (error) {
//       console.error("Error adding new data:", error);
//     }
//   };

//   console.log(selectedClass);
//   console.log(selectedSubject);

//   return (
//     <>
//       {/* <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Class Name"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Subject Name"
//           value={subjectName}
//           onChange={(e) => setSubjectName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Topic Name"
//           value={topicName}
//           onChange={(e) => setTopicName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Subtopic Name"
//           value={subtopicName}
//           onChange={(e) => setSubtopicName(e.target.value)}
//         />
//         <button type="submit">Submit</button>
//       </form> */}
//       <div>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             Classes
//           </AccordionSummary>
//           {academic &&
//             academic.classes &&
//             academic.classes.map((className, index) => (
//               <AccordionDetails key={index}>{className}</AccordionDetails>
//             ))}
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             Targets
//           </AccordionSummary>
//           {academic &&
//             academic.target &&
//             academic.target.map((tget, index) => (
//               <AccordionDetails key={index}>{tget}</AccordionDetails>
//             ))}
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             Difficulty Level
//           </AccordionSummary>
//           {academic &&
//             academic.difficultyLevel &&
//             academic.difficultyLevel.map((dLevel, index) => (
//               <AccordionDetails key={index}>{dLevel}</AccordionDetails>
//             ))}
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             Time Required
//           </AccordionSummary>
//           {academic &&
//             academic.timeRequired &&
//             academic.timeRequired.map((time, index) => (
//               <AccordionDetails key={index}>{time}</AccordionDetails>
//             ))}
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1-content"
//             id="panel1-header"
//           >
//             Subject Details
//           </AccordionSummary>
//           <div className="row">
//             <div className="col-md-3">
//               <Box component="section" sx={{ p:1 }}>
//                 <List sx={style}>
//                   {academic &&
//                     academic.classes &&
//                     academic.classes.map((className, index) => (
//                       <>
//                         <ListItem onClick={() => setSelectedClass(className)}>
//                           <ListItemText primary={className} />
//                         </ListItem>
//                         <Divider component="li" />
//                       </>
//                     ))}
//                 </List>
//               </Box>
//             </div>
//             <div className="col-md-3">
//               <Box component="section" sx={{ p: 2 }}>
//                 <List sx={style}>
//                   {academic &&
//                     academic.subjects &&
//                     academic.subjects.map((subject, index) => (
//                       <>
//                         <ListItem onClick={() => setSelectedSubject(subject)}>
//                           <ListItemText primary={subject.name} />
//                         </ListItem>
//                         <Divider component="li" />
//                       </>
//                     ))}
//                 </List>
//               </Box>
//             </div>
//             <div className="col-md-3">
//               <Box component="section" sx={{ p: 2 }}>
//                 <List sx={style}>
//                   {academic &&
//                     academic.subjects &&
//                     academic.subjects.map((subject, index) => (
//                       <>
//                         <ListItem>
//                           <ListItemText primary={subject.name} />
//                         </ListItem>
//                         <Divider component="li" />
//                       </>
//                     ))}
//                 </List>
//               </Box>
//             </div>
//           </div>
//         </Accordion>
//       </div>
//     </>
//   );
// }
