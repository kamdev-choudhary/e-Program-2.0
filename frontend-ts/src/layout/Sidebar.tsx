import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  Collapse,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { buttons } from "./buttons";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGlobalContext } from "../contexts/GlobalProvider";
import DummyUserImage from "../assets/images/user.jpg";

interface Option {
  label: string;
  path: string;
  icon?: string;
  role?: string[];
  loginRequired?: boolean;
}

interface SubMenuProps {
  menu: Option[];
  isOpen: boolean;
  navigate: NavigateFunction;
  isDarkMode: boolean;
  expanded: boolean;
  location: ReturnType<typeof useLocation>; // Added location as a prop
  isLoggedIn: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({
  menu,
  isOpen,
  navigate,
  isDarkMode,
  expanded = true,
  location,
  isLoggedIn,
}) => {
  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      {menu.map((submenu, index) => {
        if (submenu.loginRequired && !isLoggedIn) return;
        return (
          <motion.span
            key={`${submenu.label}-${index}`}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 * index }}
          >
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: expanded ? 5 : 1.6,
                  borderRadius: 1,
                  backgroundColor:
                    location.pathname === submenu.path
                      ? expanded
                        ? "rgba(40,132,79,1)"
                        : "background.primary"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      location.pathname === submenu.path
                        ? "rgba(40,132,79,0.6)"
                        : isDarkMode
                        ? "rgba(0,0,0,0.6)"
                        : "#f1f1f1",
                  },
                }}
                onClick={() => {
                  navigate(submenu.path);
                }}
              >
                {submenu.icon && (
                  <img
                    src={submenu.icon}
                    height={25}
                    alt={`${submenu.label} icon`}
                  />
                )}

                {expanded && (
                  <ListItemText
                    sx={{
                      color: location.pathname === submenu.path ? "white" : "",
                      ml: 1,
                    }}
                    primary={submenu.label}
                  />
                )}
              </ListItemButton>
            </List>
          </motion.span>
        );
      })}
    </Collapse>
  );
};

interface SidebarProps {
  isSmallScreen?: boolean;
  expanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded = true }) => {
  const { user, deviceTheme, isLoggedIn, profilePicUrl } = useGlobalContext();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = deviceTheme === "dark";

  const handleMenuClick = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <Box sx={{ width: "95%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 1,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.3, marginBottom: "15px" }}
          transition={{ duration: 0.3 }}
          style={{
            height: expanded ? "95px" : "38px",
            width: expanded ? "95px" : "38px",
          }}
        >
          <Box
            sx={{
              border: `1px solid ${
                isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }`,
              height: "100%",
              width: "100%",
              borderRadius: "50%",
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              fontSize: 40,
              fontWeight: "bold",
              color: "#28844f",
              backgroundImage: `url(${profilePicUrl || DummyUserImage})`,
              backgroundSize: "cover", // Ensures the image covers the box
              backgroundPosition: "center", // Centers the image within the box
              backgroundRepeat: "no-repeat", // Prevents tiling of the image
            }}
          >
            {/* User initials or other fallback content */}
          </Box>
        </motion.div>

        {isLoggedIn && expanded && (
          <>
            <Typography sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              {user?.name}
            </Typography>
            <Typography sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              ({user?.role})
            </Typography>
          </>
        )}
      </Box>
      <List>
        <Divider />
        {buttons.map((page, index) => {
          if (page.loginRequired && !isLoggedIn) return;

          return (
            <React.Fragment key={index}>
              <ListItemButton
                onClick={() => {
                  if (page.options) {
                    handleMenuClick(page.label);
                  } else {
                    page.path && navigate(page.path);
                  }
                }}
                sx={{
                  backgroundColor:
                    location.pathname === page.path
                      ? expanded
                        ? "rgba(40,132,79,0.9)"
                        : isDarkMode
                        ? "#000"
                        : "rgba(40,132,79,0.3)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      location.pathname === page.path
                        ? expanded
                          ? "rgba(40,132,79,0.8)"
                          : isDarkMode
                          ? "rgba(0, 0, 0, 0.8)"
                          : "rgba(40,132,79,0.5)"
                        : isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "#f1f1f1",
                  },
                  p: 1,
                  pr: expanded ? 2 : 1,
                  borderRadius: 1,
                }}
              >
                {page.icon && (
                  <img src={page.icon} height={25} alt={`${page.label} icon`} />
                )}

                {expanded && (
                  <>
                    <ListItemText
                      sx={{
                        color:
                          location.pathname === page.path
                            ? "#fff"
                            : isDarkMode
                            ? "#fff"
                            : "#000",
                        ml: 1,
                      }}
                      primary={page.label}
                    />
                    {page.options &&
                      (openMenus[page.label] ? <ExpandLess /> : <ExpandMore />)}
                  </>
                )}
              </ListItemButton>

              {page.options && (
                <SubMenu
                  menu={page.options}
                  isOpen={openMenus[page.label]}
                  navigate={navigate}
                  isDarkMode={isDarkMode}
                  expanded={expanded}
                  location={location}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
