import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Header from "./Header";
import { Box, useMediaQuery, Drawer } from "@mui/material";
import { useGlobalProvider } from "../GlobalProvider";

export default function Layout2() {
  const { deviceTheme } = useGlobalProvider();
  const [expanded, setExpanded] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width:500px)");
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          height: "67px",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          background: "background.paper",
          zIndex: 1,
        }}
      >
        <Header
          handleButtonClick={() => {
            if (isSmallScreen) {
              setOpenDrawer((prev) => !prev);
            } else {
              setExpanded((prev) => !prev);
            }
          }}
          expanded={expanded}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "67px",
          height: "calc(100vh - 67px)",
        }}
      >
        {isSmallScreen ? (
          <>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
              <Sidebar />
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              width: expanded ? "285px" : "inherit",
              transition: "width 0.3s ease",
              borderRight: "1px solid rgba(0,0,0,0.1)",
              overflowY: "auto",
              // bgcolor: deviceTheme === "light" ? "background.paper" : "#121212",
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
            padding: 1.5,
            bgcolor: "background.default",
            overflowY: "auto",
            height: "100%", // Ensure it takes full height
            pb: 2,
          }}
        >
          <Body />
        </Box>
      </Box>
    </Box>
  );
}
