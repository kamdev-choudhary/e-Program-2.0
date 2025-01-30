import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import JEEORCR from "./JEEORCR";
import JEEMainMarksVsRank from "./JEEMainMarksVsPercentile";
import JEEMainPercentileVsRank from "./JEEMainPercentileVsRank";
import JEEAdvancedCutoff from "./JEEAdvancedCutoff";

const JEEMainData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Number>(0);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Tabs
          value={activeTab}
          onChange={(_: React.SyntheticEvent, value: Number) =>
            setActiveTab(value)
          }
          variant="scrollable" // Change to "scrollable" for scroll behavior
          scrollButtons="auto" // Automatically show scroll buttons when needed
          allowScrollButtonsMobile // Enable scroll buttons for mobile screens
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="JEE Opening Closing Rank" />
          <Tab label="Main Marks Vs Percentile" />
          <Tab label="Main Percentile vs Rank" />
          <Tab label="Advanced Cutoffs" />
        </Tabs>
      </Box>
      <Box>
        {activeTab === 0 && <JEEORCR />}
        {activeTab === 1 && <JEEMainMarksVsRank />}
        {activeTab === 2 && <JEEMainPercentileVsRank />}
        {activeTab === 3 && <JEEAdvancedCutoff />}
      </Box>
    </Box>
  );
};

export default JEEMainData;
