import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Paper } from "@mui/material"; // Fixed Grid import
import { useDispatch } from "react-redux";
import SubjectsComponent from "./parts/Subjects"; // Renamed import
import SubSubjects from "./parts/SubSubjects";
import Topics from "./parts/Topics";
import SubTopics from "./parts/SubTopics";
import { getAllAcademicData } from "../../../api/academic";

// Subject interface
interface Subject {
  _id: string;
  name: string;
  description: string;
}

interface SubSubject {
  _id: string;
  name: string;
  description: string;
}

interface TopicsProps {
  _id: string;
  name: string;
  description: string;
}
interface subTopicsProps {
  _id: string;
  name: string;
  description: string;
}

const Subjects: React.FC = () => {
  const dispatch = useDispatch();

  // State variables
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subSubjects, setSubSubjects] = useState<SubSubject[]>([]);
  const [topics, setTopics] = useState<TopicsProps[]>([]);
  const [subTopics, setSubTopics] = useState<subTopicsProps[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Fetch data
  const getData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    let isMounted = true; // Safety check for component unmount
    try {
      const response = await getAllAcademicData();
      setSubjects(response?.data?.subjects || []);
      setSubSubjects(response?.data?.subSubjects || []);
      setTopics(response?.data?.topics || []);
      setSubTopics(response?.data?.subTopics || []);
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }

    return () => {
      isMounted = false; // Cleanup on component unmount
    };
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper elevation={3}>
            <SubjectsComponent
              subjects={subjects}
              setSubjects={setSubjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper elevation={3}>
            <SubSubjects
              subjects={subjects}
              subSubjects={subSubjects}
              setSubSubjects={setSubSubjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedSubSubject={selectedSubSubject}
              setSelectedSubSubject={setSelectedSubSubject}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper elevation={3}>
            <Topics
              subjects={subjects}
              subSubjects={subSubjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedSubSubject={selectedSubSubject}
              setSelectedSubSubject={setSelectedSubSubject}
              topics={topics}
              setTopics={setTopics}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper elevation={3}>
            <SubTopics
              subjects={subjects}
              subSubjects={subSubjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedSubSubject={selectedSubSubject}
              setSelectedSubSubject={setSelectedSubSubject}
              topics={topics}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              subTopics={subTopics}
              setSubTopics={setSubTopics}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Subjects;
