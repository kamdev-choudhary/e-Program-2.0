import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Paper } from "@mui/material"; // Fixed Grid import
import { useDispatch } from "react-redux";
import SubjectsComponent from "./parts/Subjects"; // Renamed import
import SubSubjects from "./parts/SubSubjects";
import Topics from "./parts/Topics";
import SubTopics from "./parts/SubTopics";
import {
  getAllSubjects,
  getAllSubSubjects,
  getAllTopics,
  getAllSubTopics,
} from "../../../api/academic";
import { useGlobalContext } from "../../../contexts/GlobalProvider";

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
  const { isValidResponse } = useGlobalContext();

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
      const subjectResponse = await getAllSubjects();
      if (isMounted && isValidResponse(subjectResponse)) {
        setSubjects(subjectResponse?.data?.subjects || []);
      }
      const subSubjectResponse = await getAllSubSubjects();
      if (isMounted && isValidResponse(subSubjectResponse)) {
        setSubSubjects(subSubjectResponse?.data?.subSubjects || []);
      }
      const topicResponse = await getAllTopics();
      if (isMounted && isValidResponse(topicResponse)) {
        setTopics(topicResponse?.data?.topics || []);
      }
      const subTopicResponse = await getAllSubTopics();
      if (isMounted && isValidResponse(subTopicResponse)) {
        setSubTopics(subTopicResponse?.data?.subTopics || []);
      }
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
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={3}>
            <SubjectsComponent
              subjects={subjects}
              setSubjects={setSubjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
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
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
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
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
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
