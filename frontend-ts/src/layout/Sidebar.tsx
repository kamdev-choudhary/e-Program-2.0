import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  Collapse,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { buttons } from "./buttons";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGlobalContext } from "../contexts/GlobalProvider";

interface Option {
  label: string;
  path: string;
  icon: React.ElementType;
  role?: string[];
  loginRequired?: boolean;
  color?: string;
}

interface SubMenuProps {
  menu: Option[];
  isOpen: boolean;
  navigate: NavigateFunction;
  expanded: boolean;
  location: ReturnType<typeof useLocation>; // Added location as a prop
  isLoggedIn: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({
  menu,
  isOpen,
  navigate,
  expanded = true,
  location,
  isLoggedIn,
}) => {
  return (
    <Collapse
      sx={{ background: "background.paper" }}
      in={isOpen}
      timeout="auto"
      unmountOnExit
    >
      {menu.map((submenu, index) => {
        if (submenu.loginRequired && !isLoggedIn) return;
        return (
          <motion.span
            key={`${submenu.label}-${index}`}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 * index }}
          >
            <List sx={{ m: 0, p: 0 }}>
              <ListItemButton
                selected={location.pathname === submenu.path}
                sx={{
                  pl: expanded ? 4 : 1.6,
                  borderRadius: 1,
                }}
                onClick={() => {
                  navigate(submenu.path);
                }}
              >
                <ListItemIcon>
                  <submenu.icon
                    sx={{ color: submenu?.color ? submenu.color : "" }}
                  />
                </ListItemIcon>

                {expanded && (
                  <ListItemText
                    sx={{
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
  const { user, isLoggedIn, profilePicUrl } = useGlobalContext();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 1,
          gap: 2,
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
              height: "100%",
              width: "100%",
              borderRadius: "50%",
              backgroundImage: `url(${profilePicUrl})`,
              backgroundSize: "cover", // Ensures the image covers the box
              backgroundPosition: "center", // Centers the image within the box
              backgroundRepeat: "no-repeat", // Prevents tiling of the image
              mb: 4,
            }}
          />
        </motion.div>

        {isLoggedIn && expanded && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography>{user?.name}</Typography>
            <Typography>({user?.role})</Typography>
          </Box>
        )}
      </Box>
      <List>
        {isLoggedIn && <Divider sx={{ mb: 1 }} />}
        {buttons.map((page, index) => {
          if (page.loginRequired && !isLoggedIn) return;
          if (page.loginRequired && user && !page.role?.includes(user?.role))
            return;

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
                selected={location.pathname === page.path}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ pr: 0.01, mr: 0 }}>
                  <page.icon sx={{ color: page?.color ? page.color : "" }} />
                </ListItemIcon>

                {expanded && (
                  <>
                    <ListItemText primary={page.label} />
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
