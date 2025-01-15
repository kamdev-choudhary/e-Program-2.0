import React, { useState } from "react";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Classes from "./Classes";
import Syllabus from "./Syllabus";
import ExamPatterns from "./ExamPatterns";
import QuestionPatterns from "./QuestionPatterns";

const Academic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Animation variants for framer-motion
  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setDirection(newValue > activeTab ? 1 : -1);
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Typography variant="h5">Manage Academic Data</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable" // Change to "scrollable" for scroll behavior
          scrollButtons="auto" // Automatically show scroll buttons when needed
          allowScrollButtonsMobile // Enable scroll buttons for mobile screens
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Class" />
          <Tab label="Subjects" />
          <Tab label="Question Pattern" />
          <Tab label="Exam Patterns" />
        </Tabs>
      </Box>
      <Box sx={{ position: "relative", overflow: "hidden", mt: 2 }}>
        <motion.div
          key={activeTab}
          custom={direction}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          {activeTab === 0 && <Classes />}
          {activeTab === 1 && <Syllabus />}
          {activeTab === 3 && <ExamPatterns />}
          {activeTab === 2 && <QuestionPatterns />}
        </motion.div>
      </Box>
    </Box>
  );
};

export default Academic;
