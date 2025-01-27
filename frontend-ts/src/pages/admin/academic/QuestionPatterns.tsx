import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  TextField,
  Button,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { AddRounded, Edit, Delete, SaveRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import { CustomModal } from "../../../components/CustomModal";
import useAxios from "../../../hooks/useAxios";

interface QuestionPattern {
  _id: string;
  name: string;
  description: string;
}

interface NewQuestionPatern {
  name: string;
  description: string;
}

const QuestionPatterns: React.FC = ({}) => {
  const axios = useAxios();
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
      setQuestionPatterns(response.data.patterns);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getQuestionPatterns();
  }, []);

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
        try {
          const response = await axios.delete(
            `/academic/question-pattern/${id}`
          );
          setQuestionPatterns(response.data.patterns);
          Swal.fire("Deleted!", "Subject has been deleted.", "success");
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to delete the pattern.", "error");
    }
  };

  const handleSaveNewQuestionPattern = async () => {
    try {
      const response = await axios.post("/academic/question-pattern", {
        name: newQuestionPattern.name,
        description: newQuestionPattern.description,
      });
      setQuestionPatterns(response.data.patterns);
      setShowAQuestionPattern(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={3} sx={{ maxWidth: 450 }}>
        <List
          subheader={
            <ListSubheader
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                bgcolor: "#608BC1",
                p: 1,
                borderRadius: 2,
              }}
            >
              <Typography sx={{ color: "#fff" }}>Question Patterns</Typography>
              <IconButton onClick={() => setShowAQuestionPattern(true)}>
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </ListSubheader>
          }
          sx={{ height: 350, overflow: "auto", m: 0, pt: 1 }}
        >
          {quesionPatterns &&
            quesionPatterns.map((pattern) => (
              <ListItem
                key={pattern._id}
                sx={{
                  m: 0,
                  p: 0,
                }}
              >
                <ListItemButton>
                  <ListItemText primary={pattern.name} />
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteSubject(pattern._id)}>
                    <Delete />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Paper>
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

export default QuestionPatterns;
