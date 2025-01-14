import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { AddRounded, Edit, Delete, SaveRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useGlobalContext } from "../../../contexts/GlobalProvider";
import { CustomModal } from "../../../components/CustomModal";
import axios from "../../../hooks/AxiosInterceptor";

interface QuestionPattern {
  _id: string;
  name: string;
  description: string;
}

interface NewQuestionPatern {
  name: string;
  description: string;
}

const Subjects: React.FC = ({}) => {
  const { isValidResponse } = useGlobalContext();
  const [quesionPatterns, setQuestionPatterns] = useState<
    QuestionPattern[] | null
  >(null);

  const [newQuestionPattern, setNewQuestionPattern] =
    useState<NewQuestionPatern>({
      name: "",
      description: "",
    });
  const [showAQuestionPattern, setShowAQuestionPattern] =
    useState<boolean>(false);

  const getQuestionPatterns = async () => {
    try {
      const response = await axios.get("/academic/question-pattern");
      if (isValidResponse(response)) {
        setQuestionPatterns(response.data.patterns);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getQuestionPatterns();
  }, []);

  // const handleSaveSubjectEdit = async () => {
  //   try {
  //     if (!selectedSubject) {
  //       return;
  //     }
  //     dispatch({ type: "SET_LOADING", payload: true });
  //     const response = await axios.patch(
  //       `/academic/subject/${selectedSubject}`,
  //       selectedSubject
  //     );
  //     if (isValidResponse(response)) {
  //       setSubjects(response.data.subjects);
  //       setShowAddSubject(false);
  //       setSelectedSubject("");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     dispatch({ type: "SET_LOADING", payload: false });
  //   }
  // };

  const handleDeleteSubject = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/academic/question-pattern/${id}`);
        if (isValidResponse(response)) {
          setQuestionPatterns(response.data.patterns);
          Swal.fire("Deleted!", "Subject has been deleted.", "success");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to delete the subject.", "error");
    }
  };

  const handleSaveNewQuestionPattern = async () => {
    try {
      const response = await axios.post("/academic/question-pattern", {
        name: newQuestionPattern.name,
        description: newQuestionPattern.description,
      });
      console.log(response);
      if (isValidResponse(response)) {
        setQuestionPatterns(response.data.patterns);
        setShowAQuestionPattern(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          bgcolor: "rgba(126, 87, 194, 0.1)",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Typography variant="h6">Question Patterns</Typography>
        <IconButton onClick={() => setShowAQuestionPattern(true)}>
          <AddRounded />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ height: 350, overflow: "auto" }}>
        {quesionPatterns &&
          quesionPatterns.map((pattern) => (
            <ListItem
              key={pattern._id}
              sx={{
                justifyContent: "space-between",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(145, 77, 126, 0.1)" },
              }}
            >
              <Typography>{pattern.name}</Typography>
              <Box>
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteSubject(pattern._id)}>
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          ))}
      </List>
      <CustomModal
        open={showAQuestionPattern}
        onClose={() => setShowAQuestionPattern(false)}
        height="auto"
        width="auto"
      >
        <Box
          sx={{
            minWidth: 350,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            value={newQuestionPattern.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewQuestionPattern((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            fullWidth
            label="Name"
          />
          <TextField
            value={newQuestionPattern.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewQuestionPattern((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            fullWidth
            label="Description"
          />
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveRounded />}
            onClick={handleSaveNewQuestionPattern}
          >
            Save
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default Subjects;
