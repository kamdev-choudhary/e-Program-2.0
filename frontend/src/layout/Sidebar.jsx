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
import { useGlobalProvider } from "../GlobalProvider";
import { pages } from "./Pages";
import { useNavigate, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { images } from "../constants/helper";
import ProfilePic from "./ProfilePic";

function SubMenu({ menu, isOpen, navigate, isDarkMode, expanded = true }) {
  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      {menu?.subMenuItem?.map((submenu, index) => (
        <List component="div" disablePadding key={index}>
          <ListItemButton
            sx={{
              pl: expanded ? 5 : 1.6,
              borderRadius: 1,
              backgroundColor:
                location.pathname === submenu.path
                  ? expanded
                    ? "rgba(76, 175, 80, 0.9)"
                    : "background.primary"
                  : "transparent",
              "&:hover": {
                backgroundColor:
                  location.pathname === submenu.path
                    ? "rgba(76, 175, 80, 1)"
                    : isDarkMode
                    ? "rgba(0,0,0,0.6)"
                    : "#f1f1f1",
              },
            }}
            onClick={() => {
              navigate(submenu.path);
            }}
          >
            <>{submenu.icon}</>
            {expanded && (
              <ListItemText
                sx={{
                  color: location.pathname === submenu.path ? "white" : "",
                  ml: 1,
                }}
                primary={submenu.name}
              />
            )}
          </ListItemButton>
        </List>
      ))}
    </Collapse>
  );
}

function Sidebar({ isSmallScreen, expanded = true }) {
  const { user, deviceTheme } = useGlobalProvider();
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = deviceTheme === "dark";

  const handleMenuClick = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const filteredPages = pages?.filter((route) => {
    if (!route.isLoginRequired && route.available.includes("all")) return true;
    const roleMatch =
      route?.available?.includes("all") ||
      route?.available?.includes(user?.role);
    return roleMatch;
  });

  return (
    <Box>
      {user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            m: 1,
          }}
        >
          <ProfilePic expanded={expanded} />

          {expanded && (
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
      )}
      <List>
        <Divider />
        {pages
          .filter((page) => {
            if (!page.isLoginRequired) {
              return true;
            } else if (page.available.includes(user?.role)) {
              return true;
            } else {
              return false;
            }
          })
          .map((page, index) => (
            <React.Fragment key={index}>
              <ListItemButton
                onClick={() => {
                  if (page.subMenu) {
                    handleMenuClick(page.name);
                  } else {
                    navigate(page.path);
                  }
                }}
                sx={{
                  backgroundColor:
                    location.pathname === page.path
                      ? expanded
                        ? "rgba(76, 175, 80, 0.9)"
                        : isDarkMode
                        ? "#000"
                        : "rgba(40,132,79,0.3)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      location.pathname === page.path
                        ? expanded
                          ? "rgba(76, 175, 80, 1)" // Lighter on hover when active
                          : isDarkMode
                          ? "rgba(0, 0, 0, 0.8)" // Darker for dark mode
                          : "rgba(40,132,79,0.5)" // Lighter for light mode
                        : isDarkMode
                        ? "rgba(255, 255, 255, 0.1)" // Slightly lighter for dark mode
                        : "#f1f1f1", // Default light hover
                  },
                  p: 1,
                  pr: expanded ? 2 : 1,
                  borderRadius: 1,
                }}
              >
                {page.icon && <>{page?.icon}</>}
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
                      primary={page.name}
                    />
                    {page.subMenu &&
                      (openMenus[page.name] ? <ExpandLess /> : <ExpandMore />)}
                  </>
                )}
              </ListItemButton>

              {page.subMenu && (
                <SubMenu
                  menu={page}
                  isOpen={openMenus[page.name]}
                  navigate={navigate}
                  isSmallScreen={isSmallScreen}
                  user={user}
                  isDarkMode={isDarkMode}
                  expanded={expanded}
                />
              )}
              <Divider />
            </React.Fragment>
          ))}
      </List>
    </Box>
  );
}

export default Sidebar;
