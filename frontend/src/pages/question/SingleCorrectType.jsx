import React, { useState } from "react";
import { Box, Checkbox, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CustomDropDown from "../../components/CustomDropDown";
import { TinyBox } from "../../components/TinyBox";

function SingleCorrectType({
  subjects,
  selectedSubject,
  setSelectedSubject,
  subSubjects,
  selectedSubSubject,
  setSelectedSubSubject,
}) {
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
              data={subjects}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              name="name"
              dropdownValue="id_subject"
              label="Subject"
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 1, p: 1 }} component={Paper} elevation={4}>
        <Box sx={{ py: 1 }}>
          <Typography variant="h6">Question Text</Typography>
        </Box>
        <TinyBox />
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
