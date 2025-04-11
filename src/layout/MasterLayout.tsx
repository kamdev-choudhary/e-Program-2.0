import React, { useState } from "react";
import { Box, useMediaQuery, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Appbar from "./Appbar";
import { useAppTheme } from "../contexts/ThemeContext";

const drawerWidth = 285; // Sidebar width

const MasterLayout: React.FC = () => {
  const { theme } = useAppTheme();
  const isSmallScreen = useMediaQuery("(max-width:475px)");
  const [expanded, setExpanded] = useState<boolean>(true);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false); // New state for hover effect
  const isLight = theme === "light";

  // Toggle Sidebar (Mobile & Desktop)
  const handleToggleSidebar = () => {
    isSmallScreen
      ? setOpenDrawer((prev) => !prev)
      : setExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Appbar
        handleButtonClick={handleToggleSidebar}
        expanded={expanded}
        isSmallScreen={isSmallScreen}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 67px)",
          p: 0,
        }}
      >
        {/* Sidebar (Collapsible for Desktop, Drawer for Mobile) */}
        {isSmallScreen ? (
          <Drawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            sx={{ "& .MuiDrawer-paper": { width: "80%", px: 2 } }}
          >
            <Sidebar expanded={true} />
          </Drawer>
        ) : (
          <motion.div
            initial={{ width: expanded ? drawerWidth : 70 }}
            animate={{ width: expanded || hovering ? drawerWidth : 70 }}
            transition={{ type: "tween", duration: 0.4, ease: "easeIn" }}
            className="no-print"
            style={{
              borderRight: "1px solid rgba(0,0,0,0.2)",
              overflowY: "auto",
              padding: expanded || hovering ? "16px" : "8px",
              height: "100%",
              scrollbarWidth: "none",
              background: isLight ? "rgba(255, 255, 255, 0.7)" : "#212327",
            }}
            onMouseEnter={() => !expanded && setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <Sidebar expanded={expanded || hovering} />
          </motion.div>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "scroll",
            height: "100%",
            pb: 2,
            p: { xs: 0.5, sm: 1.5 },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname} // Ensures animation triggers on route change
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ height: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Floating Popups */}
    </Box>
  );
};

export default MasterLayout;
