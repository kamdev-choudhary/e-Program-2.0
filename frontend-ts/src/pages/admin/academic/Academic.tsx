import { Box, Divider, Paper, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";

const Academic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h5">Manage Academic Data's</Typography>
      </Box>
      <Divider />
      <Box>
        <Tabs
          value={activeTab}
          onChange={(_: React.SyntheticEvent, newValue: number) =>
            setActiveTab(newValue)
          }
        >
          <Tab label="Class" />
          <Tab label="Subjects" />
          <Tab label="Topics" />
        </Tabs>
      </Box>
    </Paper>
  );
};

export default Academic;
