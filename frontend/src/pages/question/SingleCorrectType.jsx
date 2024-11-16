import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Paper,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CustomDropDown from "../../components/CustomDropDown";
import { TinyBox } from "../../components/TinyBox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Swal from "sweetalert2";

function SingleCorrectType({
  classes,
  selectedClass,
  setSelectedClass,
  subjects,
  filteredSubSubjects,
  filteredTopics,
  filteredSubTopics,
  selectedSubject,
  setSelectedSubject,
  selectedSubSubject,
  setSelectedSubSubject,
  selectedTopic,
  setSelectedTopic,
  selectedSubTopic,
  setSelectedSubTopic,
}) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);
  const [solution, setSolution] = useState("");
  const [errors, setErrors] = useState([]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", isCorrect: false },
    ]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSaveQuestion = async () => {
    const validate = validateQuestion();
    if (validate) {
      // Swal.fire("All ok");
      const body = {
        questionText,
        solution,
      
      }
    } else {
      // Swal.fire("Not Ok");
    }
  };

  console.log(questionText);
  console.log(options);
  console.log(solution);

  const validateQuestion = () => {
    let hasError = false;
    let newErrors = { ...errors };

    // Validate question text
    if (!questionText.trim()) {
      Swal.fire("Question Text is required");
      hasError = true;
      return false;
    } else {
      newErrors.questionText.isError = false;
    }

    // Validate options
    const isAnyCorrect = options.some((option) => option.isCorrect);
    const areAllOptionsFilled = options.every(
      (option) => option.text.trim() !== ""
    );

    if (!isAnyCorrect) {
      Swal.fire(
        "Validation Error",
        "Please mark at least one option as correct.",
        "error"
      );
      hasError = true;
    }

    if (!areAllOptionsFilled) {
      Swal.fire(
        "Validation Error",
        "Please fill in all option texts.",
        "error"
      );
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  return (
    <>
      <Box component={Paper} elevation={4} sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 1,
            borderBottom: "1px solid rgba(0,0,0,0.6)",
            mb: 2,
          }}
        >
          <Typography>Single Correct Question</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={classes}
              value={selectedClass}
              label="Class"
              name="name"
              dropdownValue="value"
              onChange={(e) => setSelectedClass(e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={subjects}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              name="name"
              dropdownValue="id_subject"
              label="Subject"
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredSubSubjects}
              value={selectedSubSubject}
              name="name"
              dropdownValue="id_sub_subject"
              label="SubSubject"
              onChange={(e) => setSelectedSubSubject(e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredTopics}
              value={selectedTopic}
              name="name"
              dropdownValue="id_topic"
              label="Topic"
              onChange={(e) => setSelectedTopic(e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
            <CustomDropDown
              data={filteredSubTopics}
              value={selectedSubTopic}
              name="name"
              dropdownValue="id_sub_topic"
              label="Sub Topic"
              onChange={(e) => setSelectedSubTopic(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 1, p: 1 }} component={Paper} elevation={4}>
        <Box sx={{ py: 1 }}>
          <Typography variant="h6">Question Text</Typography>
        </Box>
        <TinyBox
          content={questionText}
          onContentChange={(newContent) => setQuestionText(newContent)}
        />
      </Box>

      <Box sx={{ mt: 1, p: 1 }} component={Paper} elevation={4}>
        <Box sx={{ py: 1 }}>
          <Typography variant="h6">Options </Typography>
        </Box>
        {options.map((option, index) => (
          <Box
            key={option.id}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Checkbox
              checked={option.isCorrect}
              onChange={(e) =>
                handleOptionChange(index, "isCorrect", e.target.checked)
              }
            />
            <TinyBox
              content={option.text}
              onContentChange={(newContent) =>
                handleOptionChange(index, "text", newContent)
              }
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 1} // Prevent removing last option
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddOption}
          sx={{ mt: 1 }}
        >
          Add Option
        </Button>
      </Box>
      <Box sx={{ mt: 1, p: 1 }} component={Paper} elevation={4}>
        <Box sx={{ py: 1 }}>
          <Typography variant="h6">Solution Text</Typography>
        </Box>
        <TinyBox
          content={solution}
          onContentChange={(newContent) => setSolution(newContent)}
        />
      </Box>
      <Box sx={{ mt: 1, p: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleSaveQuestion}
          variant="contained"
          color="success"
          sx={{ minWidth: 150 }}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

export default SingleCorrectType;
