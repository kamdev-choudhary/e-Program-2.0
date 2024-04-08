import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { useAuth } from "../components/Auth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import QuizIcon from "@mui/icons-material/Quiz";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import React, { useEffect } from "react";
import AuthPage from "./AuthPage";

function Navbar() {
  const { isLoggedIn, logoutUser, isAdmin, name } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutUser = () => {
    logoutUser();
    handleClose(); // Close the menu after logout
  };

  const handleshowUserPage = () => {
    setShowUserPage(!showUserPage);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <List>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="./main_logo.png"
            sx={{ width: 70, height: 70 }}
          />
        </div>
        {isAdmin && (
          <NavLink to="/admin" style={{ textDecoration: "none" }}>
            <ListItem onClick={toggleDrawer(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Admin"}
                  onClick={() => toggleDrawer(false)}
                />
              </ListItemButton>
            </ListItem>
          </NavLink>
        )}
        <NavLink to="/lectures" style={{ textDecoration: "none" }}>
          <ListItem>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <OndemandVideoRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Lectures"} />
            </ListItemButton>
          </ListItem>
        </NavLink>
        {isAdmin && (
          <NavLink to="/question-bank" style={{ textDecoration: "none" }}>
            <ListItem onClick={toggleDrawer(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary={"Question Bank"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        )}
        <NavLink to="/materials" style={{ textDecoration: "none" }}>
          <ListItem onClick={toggleDrawer(false)}>
            <ListItemButton>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary={"Study Materials"} />
            </ListItemButton>
          </ListItem>
        </NavLink>
        {isLoggedIn && !isAdmin && (
          <NavLink to="/exams" style={{ textDecoration: "none" }}>
            <ListItem onClick={toggleDrawer(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Exams"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <Box sx={{ flexGrow: 2 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <NavLink to="/" className="text-white text-decoration-none">
                Dakshana
              </NavLink>
            </Typography>
            {isLoggedIn ? (
              <div>
                <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  Welcome, {name}
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
                  onClose={handleClose}
                >
                  <NavLink
                    to="/profile"
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                  </NavLink>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleLogoutUser}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleshowUserPage}
              >
                Login or Sign Up
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <Modal
        show={showUserPage}
        onHide={handleshowUserPage}
        dialogClassName="modal-md"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <AuthPage handleshowUserPage={handleshowUserPage} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleshowUserPage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Navbar;
