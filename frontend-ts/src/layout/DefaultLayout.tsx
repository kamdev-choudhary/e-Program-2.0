import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
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
      }}
    >
      {/* Sticky Navbar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10, // Ensure it stays above other content
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {isSmallScreen ? <NavbarWithDrawer /> : <Navbar />}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          p: isSmallScreen ? 1 : 2,
          pt: isSmallScreen ? 8 : 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            p: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultLayout;
