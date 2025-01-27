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
import useAxios from "../../../../hooks/useAxios";

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

interface TopicsProps {
  _id: string;
  name: string;
  description: string;
}

interface SubSubjectComponentProps {
  subjects: Subject[];
  subSubjects: SubSubject[];
  selectedSubject: string;
  topics: TopicsProps[];
  selectedSubSubject: string;
  selectedTopic: string;
  setTopics: (topic: TopicsProps[]) => void;
  setSelectedSubject: (value: string) => void;
  setSelectedSubSubject: (value: string) => void;
  setSelectedTopic: (value: string) => void;
}

const Topics: React.FC<SubSubjectComponentProps> = ({
  topics,
  setTopics,
  selectedSubject,
  subjects,
  subSubjects,
  setSelectedSubject,
  selectedSubSubject,
  setSelectedSubSubject,
  selectedTopic,
  setSelectedTopic,
}) => {
  const axios = useAxios();
  const [showAddTopic, setShowAddTopic] = useState<boolean>(false);
  const [newSubSubject, setNewSubSubject] = useState<NewSubSubject>({
    name: "",
    description: "",
  });

  const handelSaveNewSubSubject = async () => {
    try {
      const response = await axios.post("/academic/topic", {
        name: newSubSubject.name,
        description: newSubSubject.description,
        subjectId: selectedSubject,
        subSubjectId: selectedSubSubject,
      });

      setTopics(response.data.topics);
      setShowAddTopic(false);
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
            <Typography sx={{ color: "#fff" }}>Topics</Typography>
            <IconButton onClick={() => setShowAddTopic(true)}>
              <AddRounded sx={{ color: "#fff" }} />
            </IconButton>
          </ListSubheader>
        }
        sx={{ height: 350, overflow: "auto", m: 0, pt: 1 }}
      >
        {topics &&
          topics.map((topic) => (
            <ListItem
              key={topic._id}
              onClick={() => setSelectedTopic(topic._id)}
              sx={{ m: 0, p: 0 }}
            >
              <ListItemButton selected={selectedTopic === topic._id}>
                <ListItemText primary={topic.name} />
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
        open={showAddTopic}
        onClose={() => setShowAddTopic(false)}
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
          <CustomDropDown
            data={subSubjects}
            value={selectedSubSubject}
            name="name"
            dropdownValue="_id"
            label="Sub Subject"
            onChange={(e: SelectChangeEvent) =>
              setSelectedSubSubject(e.target.value)
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

export default Topics;
