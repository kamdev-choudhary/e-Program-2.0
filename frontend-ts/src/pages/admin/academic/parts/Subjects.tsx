import React, { useState } from "react";
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
import { useGlobalContext } from "../../../../contexts/GlobalProvider";
import { CustomModal } from "../../../../components/CustomModal";
import { addNewSubject } from "../../../../api/academic";
import axios from "../../../../hooks/AxiosInterceptor";

interface Subject {
  _id: string;
  name: string;
  description: string;
}

interface NewSubject {
  name: string;
  description: string;
}

interface SubjectComponentProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
}

const Subjects: React.FC<SubjectComponentProps> = ({
  subjects,
  setSubjects,
  selectedSubject,
  setSelectedSubject,
}) => {
  const { isValidResponse } = useGlobalContext();

  const [newSubject, setNewSubject] = useState<NewSubject>({
    name: "",
    description: "",
  });
  const [showAddSubject, setShowAddSubject] = useState<boolean>(false);

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject._id);
    setShowAddSubject(true);
  };

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
        const response = await axios.delete(`/academic/subject/${id}`);
        if (isValidResponse(response)) {
          setSubjects(response.data.subjects);
          Swal.fire("Deleted!", "Subject has been deleted.", "success");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to delete the subject.", "error");
    }
  };

  const handleSaveNewSubject = async () => {
    try {
      const response = await addNewSubject(newSubject);
      console.log(response);
      if (isValidResponse(response)) {
        setSubjects(response.data.subjects);
        setShowAddSubject(false);
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
        <Typography variant="h6">Subjects</Typography>
        <IconButton onClick={() => setShowAddSubject(true)}>
          <AddRounded />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ height: 350, overflow: "auto" }}>
        {subjects.map((subject) => (
          <ListItem
            key={subject._id}
            sx={{
              bgcolor: selectedSubject === subject._id ? "#914D7E" : "",
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": { bgcolor: "rgba(145, 77, 126, 0.1)" },
            }}
            onClick={() => setSelectedSubject(subject._id)}
          >
            <Typography
              sx={{
                color: selectedSubject === subject._id ? "#fff" : "",
              }}
            >
              {subject.name}
            </Typography>
            <Box>
              <IconButton onClick={() => handleEditSubject(subject)}>
                <Edit
                  sx={{
                    color: selectedSubject === subject._id ? "#fff" : "",
                  }}
                />
              </IconButton>
              <IconButton onClick={() => handleDeleteSubject(subject._id)}>
                <Delete
                  sx={{
                    color: selectedSubject === subject._id ? "#fff" : "",
                  }}
                />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <CustomModal
        open={showAddSubject}
        onClose={() => setShowAddSubject(false)}
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
            value={newSubject.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSubject((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            label="Name"
          />
          <TextField
            value={newSubject.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSubject((prev) => ({
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
            onClick={handleSaveNewSubject}
          >
            Save
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default Subjects;
