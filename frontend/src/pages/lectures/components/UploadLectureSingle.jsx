import React, { useMemo, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import CustomDropDown from "../../../components/CustomDropDown";
import { addNewLectureSingle } from "../../../api/lectures";
import { useGlobalProvider } from "../../../GlobalProvider";

function UploadLectureSingle({ classes, subjects, setShowAddLecturePopup }) {
  const { isValidResponse } = useGlobalProvider();
  const [newLecture, setNewLecture] = useState({
    classLevel: "",
    subject: "",
    chapterName: "",
    lectureNumber: "",
    videoId: "",
    facultyName: "",
    description: "",
    tags: "",
    examSpecificDetails: "",
  });

  const handleAddNewLecture = async () => {
    try {
      const response = await addNewLectureSingle({ newLecture: newLecture });
      if (isValidResponse(response)) {
        setShowAddLecturePopup(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box sx={{ display: "grid", rowGap: 2 }}>
      <CustomDropDown
        data={classes}
        label="class Level"
        value={newLecture?.classLevel}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, classLevel: e.target.value }))
        }
        dropdownValue="value"
        name="name"
      />
      <CustomDropDown
        data={subjects}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, subject: e.target.value }))
        }
        label="Subject"
        value={newLecture.subject}
        dropdownValue="id_subject"
        name="name"
      />
      <TextField
        size="small"
        label="Chapter Name"
        value={newLecture.chapterName}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, chapterName: e.target.value }))
        }
      />
      <TextField
        size="small"
        value={newLecture.lectureNumber}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, lectureNumber: e.target.value }))
        }
        label="Lecture Number"
      />
      <TextField
        size="small"
        value={newLecture.videoId}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, videoId: e.target.value }))
        }
        label="Youtube Video ID"
      />
      <TextField
        size="small"
        value={newLecture.facultyName}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, facultyName: e.target.value }))
        }
        label="Faculty Name"
      />
      <TextField
        size="small"
        value={newLecture.description}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, description: e.target.value }))
        }
        label="Descriptions"
      />
      <TextField
        size="small"
        value={newLecture.tags}
        onChange={(e) =>
          setNewLecture((prev) => ({ ...prev, tags: e.target.value }))
        }
        label="Tags"
      />
      <Button
        onClick={handleAddNewLecture}
        variant="contained"
        color="success"
        fullWidth
      >
        Save Lecture
      </Button>
    </Box>
  );
}

export default UploadLectureSingle;
