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
        <IconButton onClick={() => setShowAddSubTopic(true)}>
          <AddRounded />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ height: 350, overflow: "auto" }}>
        {subTopics &&
          subTopics.map((subject) => (
            <ListItem
              key={subject._id}
              sx={{
                justifyContent: "space-between",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(145, 77, 126, 0.1)" },
                bgcolor: selectedTopic === subject._id ? "#28844f" : "",
              }}
              onClick={() => setSelectedTopic(subject._id)}
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
