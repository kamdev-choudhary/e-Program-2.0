import React, { useEffect, useState } from "react";
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
                }}
                onClick={() => {
                  navigate(submenu.path);
                }}
              >
                <submenu.icon
                  sx={{ color: submenu?.color ? submenu.color : "" }}
                />

                {expanded && (
                  <ListItemText
                    sx={{
                      ml: 2,
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

  // New useEffect: Open submenu if current route matches any submenu path
  useEffect(() => {
    buttons.forEach((page) => {
      if (page.options) {
        // Check if any submenu option path matches the current location
        const shouldOpen = page.options.some(
          (option) => option.path === location.pathname
        );
        if (shouldOpen) {
          setOpenMenus((prev) => ({
            ...prev,
            [page.label]: true,
          }));
        }
      }
    });
  }, [location.pathname]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <motion.div
          animate={{
            scale: expanded ? 1.1 : 0.5,
          }}
          transition={{ duration: 0.4 }}
          style={{
            height: "80px",
            width: "80px",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: "50%",
              backgroundImage: `url(${profilePicUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              mb: 2,
              transition: "all 0.4s ease",
            }}
          />
        </motion.div>

        {isLoggedIn && expanded && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: "10px",
              display: "flex",
              justifyItems: "center",
              flexDirection: "column",
              alignItems: "center",
              margin: "15px 0px",
            }}
          >
            <Typography variant="subtitle1">{user?.name}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ({user?.role})
            </Typography>
          </motion.div>
        )}
      </Box>
      <List>
        {isLoggedIn && <Divider sx={{ mb: 1 }} />}
        {buttons.map((page, index) => {
          if (page.loginRequired && !isLoggedIn) return;
          if (page.loginRequired && user && !page.roles?.includes(user?.role))
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
              >
                <page.icon sx={{ color: page?.color ? page.color : "" }} />

                {expanded && (
                  <>
                    <ListItemText
                      sx={{
                        ml: 2,
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
