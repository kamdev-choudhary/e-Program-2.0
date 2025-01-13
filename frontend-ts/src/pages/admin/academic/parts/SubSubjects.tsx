import { AddRounded, Delete, Edit, SaveRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
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
        <Typography variant="h6">Sub Subjects</Typography>
        <IconButton onClick={() => setShowAddSubSubject(true)}>
          <AddRounded />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ height: 350, overflow: "auto" }}>
        {subSubjects &&
          subSubjects.map((subject) => (
            <ListItem
              key={subject._id}
              sx={{
                justifyContent: "space-between",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(145, 77, 126, 0.1)" },
                bgcolor: selectedSubSubject === subject._id ? "#914d7e" : "",
              }}
              onClick={() => setSelectedSubSubject(subject._id)}
            >
              <Typography>{subject.name}</Typography>
              <Box>
                <IconButton>
                  <Edit />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </Box>
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
