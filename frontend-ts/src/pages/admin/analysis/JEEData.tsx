import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import JEEORCR from "./JEEORCR";
import JEEMainMarksVsRank from "./JEEMainMarksVsRank";

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
        >
          <Tab label="JEE Opening Closing Rank" />
          <Tab label="JEE Main Marks Vs Rank" />
        </Tabs>
      </Box>
      <Box>
        {activeTab === 0 && <JEEORCR />}
        {activeTab === 1 && <JEEMainMarksVsRank />}
      </Box>
    </Box>
  );
};

export default JEEMainData;
