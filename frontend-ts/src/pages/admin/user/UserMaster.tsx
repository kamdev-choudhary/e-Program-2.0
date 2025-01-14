import React, { useState } from "react";
import AdminUser from "./parts/AdminUser";
import { Paper, Tabs, Tab } from "@mui/material";
import ScholarUser from "./parts/ScholarUser";

const UserMaster = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <Paper>
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
    </Paper>
  );
};

export default UserMaster;
