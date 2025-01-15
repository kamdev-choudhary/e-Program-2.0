import { AddRounded, Delete, Edit, SaveRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { CustomModal } from "../../../../components/CustomModal";
import CustomDropDown from "../../../../components/CustomDropDown";
import axios from "../../../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../../../contexts/GlobalProvider";

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

interface NewSubSubject {
  name: string;
  description: string;
}

interface SubSubjectComponentProps {
  selectedSubSubject: string;
  setSelectedSubSubject: (subsubject: string) => void;
  subjects: Subject[];
  subSubjects: SubSubject[];
  setSubSubjects: (subsubjects: SubSubject[]) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
}

const SubSubjects: React.FC<SubSubjectComponentProps> = ({
  selectedSubSubject,
  setSelectedSubSubject,
  selectedSubject,
  subjects,
  subSubjects,
  setSubSubjects,
  setSelectedSubject,
}) => {
  const { isValidResponse } = useGlobalContext();
  const [showAddSubSubject, setShowAddSubSubject] = useState<boolean>(false);
  const [newSubSubject, setNewSubSubject] = useState<NewSubSubject>({
    name: "",
    description: "",
  });

  const handelSaveNewSubSubject = async () => {
    try {
      const response = await axios.post("/academic/sub-subject", {
        name: newSubSubject.name,
        description: newSubSubject.description,
        subject: selectedSubject,
      });
      if (isValidResponse(response)) {
        setSubSubjects(response.data.subSubjects);
        setShowAddSubSubject(false);
      }
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
            <Typography sx={{ color: "#fff" }}>Sub Subjects</Typography>
            <IconButton onClick={() => setShowAddSubSubject(true)}>
              <AddRounded sx={{ color: "#fff" }} />
            </IconButton>
          </ListSubheader>
        }
        sx={{ height: 350, overflow: "auto", m: 0, pt: 1 }}
      >
        {subSubjects &&
          subSubjects.map((subSubject) => (
            <ListItem
              key={subSubject._id}
              onClick={() => setSelectedSubSubject(subSubject._id)}
              sx={{ m: 0, p: 0 }}
            >
              <ListItemButton selected={selectedSubSubject === subSubject._id}>
                <ListItemText primary={subSubject.name} />
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <CustomModal
        open={showAddSubSubject}
        onClose={() => setShowAddSubSubject(false)}
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
          <CustomDropDown
            data={subjects}
            value={selectedSubject}
            name="name"
            dropdownValue="_id"
            label="Subject"
            onChange={(e: SelectChangeEvent) =>
              setSelectedSubject(e.target.value)
            }
          />
          <TextField
            value={newSubSubject.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSubSubject((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            label="Name"
          />
          <TextField
            value={newSubSubject.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSubSubject((prev) => ({
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
            onClick={handelSaveNewSubSubject}
          >
            Save
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default SubSubjects;
