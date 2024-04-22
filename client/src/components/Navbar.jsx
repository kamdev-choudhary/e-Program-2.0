import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { useAuth } from "../store/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from "./AuthPage";
import Sidebar from "./Sidebar";
import {
  Button,
  MenuItem,
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  Popover,
  Menu,
} from "@mui/material";

import {
  Menu as MenuIcon,
  AccountCircle,
  NotificationsRounded as NotificationsRoundedIcon,
} from "@mui/icons-material";

export default function Navbar() {
  const { isLoggedIn, logoutUser, isAdmin, name } = useAuth();

  const [open, setOpen] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);
  const [showNotification, setShowNofication] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 500,
    boxShadow: 100,
    backdropFilter: "blur(5px)",
    backgroundColor: "#FFF",
    borderRadius: 2,
    p: 4,
  };
  const idForNotification = showNotification
    ? "notification-popover"
    : undefined;

  const handleNotificationPopover = () => {
    setShowNofication(!showNotification);
  };

  const handleshowUserPage = () => {
    setShowUserPage(!showUserPage);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="#000"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#fff" }}
          >
            <NavLink to="/" className=" text-decoration-none">
              e-Program
            </NavLink>
          </Typography>
          <IconButton onClick={handleNotificationPopover}>
            <NotificationsRoundedIcon />
          </IconButton>
          <Popover
            id={idForNotification}
            open={showNotification}
            anchorEl={anchorEl}
            onClose={handleNotificationPopover}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 4,
                ml: -20,
                minWidth: 500,
              },
            }}
          >
            <Typography sx={{ p: 2 }}>Notification</Typography>
          </Popover>
          {isLoggedIn ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="#000"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                  My account
                </MenuItem>
                <MenuItem
                  sx={{ color: "#444" }}
                  onClick={() => {
                    logoutUser();
                    setAnchorEl(null);
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="outlined"
              color="error"
              sx={{
                borderRadius: 100,
              }}
              onClick={() => setShowUserPage(true)}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Sidebar toggleDrawer={toggleDrawer} />
      </Drawer>

      <Modal open={showUserPage} onClose={() => setShowUserPage(false)}>
        <Box sx={style}>
          <AuthPage handleshowUserPage={handleshowUserPage} />
          <hr />
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setShowUserPage(false)}
            sx={{ borderRadius: 10, position: "fixed", right: 10, bottom: 10 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
