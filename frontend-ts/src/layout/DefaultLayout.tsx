import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const DefaultLayout: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "#f1f3fb", height: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DefaultLayout;
