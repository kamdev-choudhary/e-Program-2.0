import React, { useState } from "react";
import AdminUser from "./parts/AdminUser";
import { Tabs, Tab, Box } from "@mui/material";
import ScholarUser from "./parts/ScholarUser";

const UserMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_: React.SyntheticEvent, value: number) =>
          setActiveTab(value)
        }
      >
        <Tab label="Admin" />
        <Tab label="Scholars" />
      </Tabs>
      {activeTab === 0 && <AdminUser />}
      {activeTab === 1 && <ScholarUser />}
    </Box>
  );
};

export default UserMaster;
