import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OnlineExams from "../components/OnlineExams";
import OfflineExams from "../components/OfflineExams";
import { useState } from "react";

export default function ExamPage() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Online Exams" value="1" />
              <Tab label="Offline Exams" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <OnlineExams />
          </TabPanel>
          <TabPanel value="2">
            <OfflineExams />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
