import React, { useState } from "react";
import ScrollableTabs from "../../components/ScrollableTabs";
import { Box, Paper, Typography } from "@mui/material";
import { API_URL, icons } from "../../constants/helper";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const tabs = [
  { name: "Admin", value: "admin", icon: icons.admin },
  { name: "Students", value: "student", icon: icons.users },
];

function Users() {
  const [selectedTab, setSelectedTab] = useState("admin");
  const [users, setUsers] = useState([]);

  const getUsersByRole = async () => {
    const response = await axios.get(`${API_URL}/auth`);
  };

  const columns = [
    { field: "SN", headerName: "SN", width: 60 },
    { field: "name", headerName: "Name", width: 150, flex: 1 },
    { field: "email", headerName: "Email", width: 150, flex: 1 },
    { field: "mobile", headerName: "Mobile", width: 150, flex: 1 },
  ];

  const rows = [];

  return (
    <Box>
      <Box>
        <ScrollableTabs
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </Box>
      {selectedTab === "admin" && (
        <Box component={Paper}>
          <DataGrid columns={columns} rows={rows} />
        </Box>
      )}
    </Box>
  );
}

export default Users;
