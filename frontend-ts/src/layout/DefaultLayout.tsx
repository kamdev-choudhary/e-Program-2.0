import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Paper, useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import NavbarWithDrawer from "./NavbarWithDrawer";

const DefaultLayout: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        bgcolor: "#f1f3fb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Sticky Navbar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {isSmallScreen ? <NavbarWithDrawer /> : <Navbar />}
      </Box>

      {/* Main Content Area */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent global scrolling
          mt: isSmallScreen ? 6 : 0,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto", // Enable scrolling here
            bgcolor: "#fff",
            borderRadius: 2,
            p: isSmallScreen ? 1 : 2,
            height: "calc(100vh - 88px)", // Adjust height dynamically (subtract navbar height)
          }}
          component={Paper}
          elevation={6}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultLayout;
