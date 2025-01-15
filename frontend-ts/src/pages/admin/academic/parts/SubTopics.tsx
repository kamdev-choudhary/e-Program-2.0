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

interface newTopic {
  name: string;
  description: string;
}

interface TopicsProps {
  _id: string;
  name: string;
  description: string;
}

interface SubTopicsProps {
  _id: string;
  name: string;
  description: string;
}

interface SubSubjectComponentProps {
  subjects: Subject[];
  subSubjects: SubSubject[];
  topics: TopicsProps[];
  subTopics: SubTopicsProps[];
  selectedSubject: string;
  selectedSubSubject: string;
  selectedTopic: string;
  setSubTopics: (topic: TopicsProps[]) => void;
  setSelectedSubject: (value: string) => void;
  setSelectedSubSubject: (value: string) => void;
  setSelectedTopic: (value: string) => void;
}

const SubTopic: React.FC<SubSubjectComponentProps> = ({
  subTopics,
  topics,
  setSubTopics,
  selectedSubject,
  subjects,
  subSubjects,
  setSelectedSubject,
  selectedSubSubject,
  setSelectedSubSubject,
  selectedTopic,
  setSelectedTopic,
}) => {
  const { isValidResponse } = useGlobalContext();
  const [showAddTopic, setShowAddSubTopic] = useState<boolean>(false);
  const [newTopic, setNewTopic] = useState<newTopic>({
    name: "",
    description: "",
  });

  const handelSavenewSubTopic = async () => {
    try {
      const response = await axios.post("/academic/sub-topic", {
        name: newTopic.name,
        description: newTopic.description,
        subjectId: selectedSubject,
        subSubjectId: selectedSubSubject,
        topicId: selectedTopic,
      });
      if (isValidResponse(response)) {
        setSubTopics(response.data.subTopics);
        setShowAddSubTopic(false);
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
            <Typography sx={{ color: "#fff" }}>Sub Topics</Typography>
            <IconButton onClick={() => setShowAddSubTopic(true)}>
              <AddRounded sx={{ color: "#fff" }} />
            </IconButton>
          </ListSubheader>
        }
        sx={{ height: 350, overflow: "auto", m: 0, pt: 1 }}
      >
        {subTopics &&
          subTopics.map((subject) => (
            <ListItem key={subject._id} sx={{ m: 0, p: 0 }}>
              <ListItemButton>
                <ListItemText primary={subject.name} />
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
        onClose={() => setShowAddSubTopic(false)}
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
          <CustomDropDown
            data={topics}
            value={selectedTopic}
            name="name"
            dropdownValue="_id"
            label="Topics"
            onChange={(e: SelectChangeEvent) =>
              setSelectedTopic(e.target.value)
            }
          />
          <TextField
            value={newTopic.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTopic((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            label="Name"
          />
          <TextField
            value={newTopic.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTopic((prev) => ({
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
            onClick={handelSavenewSubTopic}
          >
            Save
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default SubTopic;
