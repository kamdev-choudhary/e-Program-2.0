import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import NavbarWithDrawer from "./NavbarWithDrawer";

const DefaultLayout: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Box sx={{ bgcolor: "#f1f3fb", height: "100vh" }}>
      {isSmallScreen ? <NavbarWithDrawer /> : <Navbar />}
      <Box sx={{ p: isSmallScreen ? 1 : 4, pt: isSmallScreen ? 8 : 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DefaultLayout;
