import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid2 as Grid,
} from "@mui/material";

interface Lecture {
  _id?: string; // Optional because it's generated by the database
  title: string;
  subject: string;
  className: string;
  chapter: string;
  topic: string;
  link: string;
  linkType: string;
  facultyName: string;
  lectureNumber: string;
}

interface AddSingleLectureProp {
  setShowAddSingleLecture: (value: boolean) => void;
  lectures: Lecture[] | null;
  setLectures: (value: any) => void;
}

const AddSingleLecture: React.FC<AddSingleLectureProp> = ({
  setShowAddSingleLecture,
  lectures,
  setLectures,
}) => {
  const [newLecture, setNewLecture] = useState<Lecture>({
    title: "",
    subject: "",
    className: "",
    chapter: "",
    topic: "",
    link: "",
    linkType: "youtube", // Default value
    facultyName: "",
    lectureNumber: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof Lecture, value: string) => {
    setNewLecture((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !newLecture.title ||
      !newLecture.subject ||
      !newLecture.link ||
      !newLecture.lectureNumber
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/lectures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLecture),
      });

      const result = await response.json();
      setShowAddSingleLecture(false);
      setLectures([lectures, result.data.newLecture]);
    } catch (err) {
      console.error("Error submitting lecture:", err);
      setError("An error occurred while adding the lecture.");
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            label="Lecture Title"
            // margin="normal"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            label="Subject"
            // margin="normal"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.className}
            onChange={(e) => handleInputChange("className", e.target.value)}
            label="Class Name"
            // margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.chapter}
            onChange={(e) => handleInputChange("chapter", e.target.value)}
            label="Chapter"
            // margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
            label="Topic"
            // margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            label="Lecture Link"
            // margin="normal"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            value={newLecture.linkType}
            onChange={(e) => handleInputChange("linkType", e.target.value)}
            label="Link Type"
            // margin="normal"
          >
            <MenuItem value="youtube">YouTube</MenuItem>
            <MenuItem value="vimeo">Vimeo</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.facultyName}
            onChange={(e) => handleInputChange("facultyName", e.target.value)}
            label="Faculty Name"
            // margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            value={newLecture.lectureNumber}
            onChange={(e) => handleInputChange("lectureNumber", e.target.value)}
            label="Lecture Number"
            // margin="normal"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}></Grid>
      </Grid>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AddSingleLecture;
