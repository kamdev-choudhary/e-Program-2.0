import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  TextField,
  Button,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Edit, Delete, SaveRounded, AddRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
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
  const [newSubject, setNewSubject] = useState<NewSubject>({
    name: "",
    description: "",
  });
  const [showAddSubject, setShowAddSubject] = useState<boolean>(false);

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject._id);
    setShowAddSubject(true);
  };

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
        try {
          setSubjects(response.data.subjects);
          Swal.fire("Deleted!", "Subject has been deleted.", "success");
        } catch (error) {
          console.error(error);
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
      setSubjects(response.data.subjects);
      setShowAddSubject(false);
      setNewSubject({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <List
        subheader={
          <ListSubheader
            component="div"
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
            <Typography sx={{ color: "#fff" }}>Subjects</Typography>
            <IconButton onClick={() => setShowAddSubject(true)}>
              <AddRounded sx={{ color: "#fff" }} />
            </IconButton>
          </ListSubheader>
        }
        component="nav"
        sx={{ height: 350, overflow: "auto", m: 0, pt: 1 }}
      >
        {subjects.map((subject) => (
          <ListItem
            key={subject._id}
            onClick={() => setSelectedSubject(subject._id)}
            sx={{ m: 0, p: 0 }}
          >
            <ListItemButton selected={selectedSubject === subject._id}>
              <ListItemText primary={subject.name} />
              <Box>
                <IconButton onClick={() => handleEditSubject(subject)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteSubject(subject._id)}>
                  <Delete />
                </IconButton>
              </Box>
            </ListItemButton>
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
            size="small"
            value={newSubject.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSubject((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            label="Name"
          />
          <TextField
            size="small"
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
