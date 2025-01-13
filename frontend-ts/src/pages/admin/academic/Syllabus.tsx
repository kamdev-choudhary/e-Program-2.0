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
  value: string;
}

const Subjects: React.FC = () => {
  const dispatch = useDispatch();
  const { isValidResponse } = useGlobalContext();

  // State variables
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subSubjects, setSubSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Subject[]>([]);
  const [subTopics, setSubTopics] = useState<Subject[]>([]);

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
      <Grid container>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={3} sx={{ m: 1 }}>
            <SubjectsComponent subjects={subjects} setSubjects={setSubjects} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={3} sx={{ m: 1 }}>
            <SubSubjects
              subSubjects={subSubjects}
              setSubSubjects={setSubSubjects}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={3} sx={{ m: 1 }}>
            <Topics topics={topics} setTopics={setTopics} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={3} sx={{ m: 1 }}>
            <SubTopics subTopics={subTopics} setSubTopics={setSubTopics} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Subjects;
