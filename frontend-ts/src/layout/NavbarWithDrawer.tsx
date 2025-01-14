import React, { useState, useCallback } from "react";
import {
  Box,
  List,
  Collapse,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Drawer,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore, MenuRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import { buttons } from "./buttons";
import { useGlobalContext } from "../contexts/GlobalProvider";

interface Option {
  label: string;
  path: string;
  icon?: React.ElementType;
  loginRequired?: boolean;
}

interface Button {
  label: string;
  path?: string;
  icon: React.ElementType;
  type: "button" | "menu";
  options?: Option[];
  color?: string;
  size?: number;
  role?: string[];
  loginRequired?: boolean;
}

interface SubMenuProps {
  menu: Button;
  isOpen: boolean;
  navigate: ReturnType<typeof useNavigate>;
  user: any;
  isLoggedIn: boolean;
  location: any;
  icon?: React.ElementType;
}

const SubMenu = React.memo(
  ({ menu, isOpen, navigate, isLoggedIn, location }: SubMenuProps) => {
    return (
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {menu.options
          ?.filter(
            (submenu) =>
              !submenu.loginRequired || (isLoggedIn && submenu.loginRequired)
          )
          .map((submenu, index) => (
            <motion.span
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2 * index }}
              key={index}
            >
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => navigate(submenu.path)}
                  sx={{
                    ml: 1,
                    bgcolor:
                      location.pathname === submenu.path ? "#007bff" : "", // Blue color for selected
                    "&:hover": {
                      bgcolor:
                        location.pathname === submenu.path ? "#0056b3" : "", // Darker blue on hover
                    },
                    borderRadius: 2,
                  }}
                >
                  <ListItemText
                    sx={{
                      color: location.pathname === submenu.path ? "white" : "", // White text for selected
                      ml: 1,
                    }}
                    primary={submenu.label}
                  />
                </ListItemButton>
              </List>
            </motion.span>
          ))}
      </Collapse>
    );
  }
);

const NavbarWithDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const { user, isLoggedIn } = useGlobalContext();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = useCallback((menuLabel: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel], // Toggle the specific menu
    }));
  }, []);

  const renderButton = useCallback(
    (button: Button) => {
      return (
        <React.Fragment key={button.label}>
          {(button.role?.includes(user?.role || "") || !button.role) && (
            <>
              <ListItemButton
                onClick={() => {
                  if (button.type === "menu" && button.options) {
                    handleMenuClick(button.label); // Toggle menu collapse
                  } else if (button.path) {
                    navigate(button.path); // Navigate to path for button
                  }
                }}
                sx={{
                  ml: 1,
                  bgcolor: location.pathname === button.path ? "#007bff" : "", // Blue color for selected
                  "&:hover": {
                    bgcolor: location.pathname === button.path ? "#0056b3" : "", // Darker blue on hover
                  },
                  borderRadius: 2,
                }}
              >
                {button.icon && (
                  <button.icon
                    sx={{
                      color: location.pathname === button.path ? "#fff" : "",
                    }}
                  />
                )}
                <ListItemText
                  primary={button.label}
                  sx={{
                    ml: 1,
                    color: location.pathname === button.path ? "white" : "", // White text for selected
                  }}
                />
                {button.type === "menu" &&
                  (openMenus[button.label] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {button.type === "menu" && button.options && (
                <SubMenu
                  menu={button}
                  isOpen={openMenus[button.label]} // Pass correct collapse state
                  navigate={navigate}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  location={location}
                />
              )}
            </>
          )}
        </React.Fragment>
      );
    },
    [user?.role, openMenus, navigate, location.pathname]
  );

  return (
    <Box sx={{ p: 1, position: "fixed", bgcolor: "#fff", width: "100vw" }}>
      <IconButton onClick={handleDrawerToggle}>
        <MenuRounded />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                border: `1px solid rgba(0,0,0,0.1)"
                `,
                height: 180,
                width: 180,
                borderRadius: "50%",
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                color: "#28844f",
                // backgroundImage: images[user?.email]
                //   ? `url(${images[user.email]})`
                //   : "none",
                backgroundSize: "cover",
                backgroundPosition: "top",
              }}
            >
              {/* {!images[user?.email] && (
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
              )} */}
            </Box>
            <Typography variant="body1">{user?.name}</Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <List>
              <Divider sx={{ mb: 1 }} />
              {buttons.map(renderButton)}
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavbarWithDrawer;
