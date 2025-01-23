import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Box, useMediaQuery, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";

const MasterLayout: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const isSmallScreen = useMediaQuery("(max-width:500px)");
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.bg",
      }}
    >
      <Header
        handleButtonClick={() => {
          isSmallScreen
            ? setOpenDrawer((prev) => !prev)
            : setExpanded((prev) => !prev);
        }}
        expanded={expanded}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 67px)",
        }}
      >
        {isSmallScreen ? (
          <Drawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            sx={{
              width: "80%",
              "& .MuiDrawer-paper": {
                width: "80%", // Set the drawer paper width to 90%
                px: 2,
              },
            }}
          >
            <Sidebar expanded={true} />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: expanded ? "285px" : "inherit",
              transition: "width 0.3s ease",
              borderRight: "1px solid rgba(0,0,0,0.2)",
              overflowY: "auto",
              bgcolor: "background.paper",
              p: 1,
              py: expanded ? 2 : 1,
              height: "100%",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <Sidebar expanded={expanded} />
          </Box>
        )}

        <Box
          sx={{
            flex: 1, // This will take the remaining space
            overflowY: "auto",
            height: "100%", // Ensure it takes full height
            pb: 2,
            p: 1.5,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MasterLayout;
