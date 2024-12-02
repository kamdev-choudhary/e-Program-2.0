import React, { useEffect, useMemo, useState } from "react";
import CustomDropDown from "../../components/CustomDropDown";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  TextField,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { useGlobalProvider } from "../../GlobalProvider";
import { useDispatch } from "react-redux";
import { CustomModal } from "../../components/CustomModal";
import { DataGrid } from "@mui/x-data-grid";
import { AddRounded, MenuRounded, RefreshRounded } from "@mui/icons-material";
import QuestionTypeForm from "./QuestionTypeForm";
import { getAllAcademicData } from "../../api/academic";

function QuestionBank() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subSubjects, setSubSubjecs] = useState([]);
  const [selectedSubSubject, setSelectedSubSubject] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [subTopics, setSubTopics] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState("");
  const [searchText, setSearchText] = useState("");

  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [addQuestionType, setAddQuestionType] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getMetaData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await getAllAcademicData();
      if (isValidResponse(response)) {
        setClasses(response.data.classes);
        setSubjects(response.data.subjects);
        setSubSubjecs(response.data.subSubjects);
        setTopics(response.data.topics);
        setSubTopics(response.data.subTopics);
        setQuestionTypes(response.data.patterns);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getMetaData();
  }, []);

  const filteredSubSubjects = useMemo(() => {
    return subSubjects.filter((s) => s.id_subject === selectedSubject);
  }, [selectedSubject, subjects]);

  const filteredTopics = useMemo(() => {
    return topics.filter(
      (t) =>
        t.id_subject === selectedSubject &&
        t.id_sub_subject === selectedSubSubject
    );
  }, [topics, selectedSubSubject]);

  const filteredSubTopics = useMemo(() => {
    return subTopics.filter((t) => {
      const subjectMatch = t.id_subject === selectedSubject;
      const subSubjectMatch = t.id_sub_subject === selectedSubSubject;
      const topicMatch = t.id_topic == selectedTopic;
      return subjectMatch && subSubjectMatch && topicMatch;
    });
  }, [topics, selectedTopic]);

  const getQuestions = async () => {};

  const columns = [
    {
      field: "id",
      headerName: "SN",
      flex: 1,
      minWidth: 60,
    },
    {
      field: "questionText",
      headerName: "Question",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "class",
      headerName: "Class Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 200,
    },
  ];
  const rows = [
    { id: 1, questionText: "jdhjhj", class: 12, subject: "Physics" },
  ];

  return (
    <div>
      <Box component={Paper} sx={{ p: 1 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={classes}
              value={selectedClass}
              name="name"
              dropdownValue="value"
              label="Classes"
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={subjects}
              label="Subjects"
              value={selectedSubject}
              name="name"
              dropdownValue="id_subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredSubSubjects}
              value={selectedSubSubject}
              name="name"
              dropdownValue="id_sub_subject"
              label="Sub Subject"
              onChange={(e) => setSelectedSubSubject(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredTopics}
              value={selectedTopic}
              name="name"
              dropdownValue="id_topic"
              label="Topics"
              onChange={(e) => setSelectedTopic(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredSubTopics}
              value={selectedSubTopic}
              name="name"
              label="Sub Topic"
              dropdownValue="id_sub_topic"
              onChange={(e) => setSelectedSubTopic(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={questionTypes}
              value={selectedQuestionTypes}
              name="name"
              label="Question Pattern"
              dropdownValue="id_pattern"
              onChange={(e) => setSelectedQuestionTypes(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Box component={Paper} sx={{ mt: 1, p: 1 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <TextField
              fullWidth
              label="Search Question"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <Button
              onClick={getQuestions}
              variant="contained"
              color="success"
              fullWidth
              startIcon={<RefreshRounded />}
            >
              Get Questions
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <Button
              fullWidth
              onClick={() => setShowQuestionTypes(true)}
              variant="contained"
              startIcon={<AddRounded />}
            >
              Add Question
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 2 }}>
            <Button
              fullWidth
              startIcon={<MenuRounded />}
              variant="contained"
              color="secondary"
              onClick={handleOpenUserMenu}
            >
              More Options
            </Button>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-more-options"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem sx={{ minWidth: "200px" }}>Question by Text</MenuItem>
              <MenuItem sx={{ minWidth: "200px" }}>Download as PDF</MenuItem>
              <MenuItem sx={{ minWidth: "200px" }}>Download as Word</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Box>
      <Box component={Paper} sx={{ mt: 1 }}>
        <Box sx={{ p: 1 }}>
          <Pagination count={100} />
        </Box>
        <Box>
          <DataGrid
            checkboxSelection
            columns={columns}
            rows={rows}
            initialState={{ pagination: { paginationModel: { page: 20 } } }}
            pageSizeOptions={[10, 20, 30, 50]}
          />
        </Box>
        <Box sx={{ p: 1 }}>
          <Pagination count={100} />
        </Box>
      </Box>

      {/* Modal for Question Types */}
      <CustomModal
        open={showQuestionTypes}
        onClose={() => setShowQuestionTypes(false)}
        header="Question Types"
        height="auto"
        width="auto"
      >
        <Box sx={{ minWidth: "450px" }}>
          <Box sx={{ display: "grid", rowGap: 1 }}>
            {questionTypes?.map((type, index) => (
              <React.Fragment key={index}>
                <Button
                  onClick={() => {
                    setShowAddQuestion(true);
                    setAddQuestionType(type?.id_pattern);
                    setShowQuestionTypes(false);
                  }}
                  variant="contained"
                  fullWidth
                >
                  {type?.name}
                </Button>
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </CustomModal>

      {/* Modal for Question type */}
      <CustomModal
        open={showAddQuestion}
        onClose={() => setShowAddQuestion(false)}
        header="Add Question"
        height="98vh"
      >
        <QuestionTypeForm
          type={addQuestionType}
          classes={classes}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          subjects={subjects}
          filteredSubSubjects={filteredSubSubjects}
          filteredTopics={filteredTopics}
          filteredSubTopics={filteredSubTopics}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedSubSubject={selectedSubSubject}
          setSelectedSubSubject={setSelectedSubSubject}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          selectedSubTopic={selectedSubTopic}
          setSelectedSubTopic={setSelectedSubTopic}
        />
      </CustomModal>
    </div>
  );
}

export default QuestionBank;
