import React, { useState } from "react";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CustomDropDown from "../../components/CustomDropDown";
import { TinyBox } from "../../components/TinyBox";

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
  console.log(questionText);
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
          onContentChange={(e) => setQuestionText(e.target.value)}
        />
      </Box>
      <Box sx={{ mt: 1, p: 1 }} component={Paper} elevation={4}>
        <Box sx={{ py: 1 }}>
          <Typography variant="h6">Options </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox />
          <TinyBox />
        </Box>
      </Box>
    </>
  );
}

export default SingleCorrectType;
