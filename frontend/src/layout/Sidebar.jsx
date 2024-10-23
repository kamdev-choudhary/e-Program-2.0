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

function SubMenu({
  menu,
  isOpen,
  navigate,
  user,
  isDarkMode,
  expanded = true,
}) {
  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      {menu.subMenuItem
        ?.filter((page) => page.available.includes(user?.id_role))
        .map((submenu, index) => (
          <List component="div" disablePadding key={index}>
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
  const isDarkMode = false;

  const handleMenuClick = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 1,
        }}
      >
        <Box
          sx={{
            height: expanded ? 95 : 38,
            width: expanded ? 95 : 38,
            // border: `1px solid ${
            //   isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
            // }`,
            borderRadius: "50%",
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: isDarkMode ? "#424242" : "#f0f0f0",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            fontSize: 40,
            fontWeight: "bold",
            color: "#28844f",
            backgroundImage: images[user?.email]
              ? `url(${images[user.email]})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          {!images[user?.email] && (
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {user?.name?.[0] || ""}
              {user?.name?.split(" ")?.[1]?.[0] || ""}
            </span>
          )}
        </Box>

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
      <List>
        <Divider />
        {pages.map((page, index) => (
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
                      ? "rgba(40,132,79,0.9)"
                      : isDarkMode
                      ? "#000"
                      : "rgba(40,132,79,0.3)"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    location.pathname === page.path
                      ? expanded
                        ? "rgba(40,132,79,0.8)" // Lighter on hover when active
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
              {page.icon && <>{page.icon}</>}
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
