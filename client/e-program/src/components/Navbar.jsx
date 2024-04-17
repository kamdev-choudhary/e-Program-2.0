import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useAuth } from "../components/Auth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ForumIcon from "@mui/icons-material/Forum";
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
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import React, { useEffect } from "react";
import AuthPage from "./AuthPage";

function Navbar() {
  const { isLoggedIn, logoutUser, isAdmin, name } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);

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
      role="presentation"
      onClick={() => toggleDrawer(false)}
      sx={{
        width: 250,
        backdropFilter: "blur(5px)",
        borderRadius: "10px",
      }}
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
            sx={{ width: 50, height: 50 }}
          />
        </div>
        {isAdmin && (
          <>
            <NavLink to="/admin" style={{ textDecoration: "none" }}>
              <ListItem onClick={toggleDrawer(false)}>
                <ListItemButton>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"DashBoard"}
                    onClick={() => toggleDrawer(false)}
                  />
                </ListItemButton>
              </ListItem>
            </NavLink>
            <NavLink to="/academic" style={{ textDecoration: "none" }}>
              <ListItem onClick={toggleDrawer(false)}>
                <ListItemButton>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Academic"} />
                </ListItemButton>
              </ListItem>
            </NavLink>
            <NavLink to="/users" style={{ textDecoration: "none" }}>
              <ListItem onClick={toggleDrawer(false)}>
                <ListItemButton>
                  <ListItemIcon>
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText primary={"User Master"} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          </>
        )}

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
        {isAdmin && (
          <NavLink to="/examtemplate" style={{ textDecoration: "none" }}>
            <ListItem onClick={toggleDrawer(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary={"Exam Master"} />
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
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary={"Exams"} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        )}
        <NavLink to="/doubts" style={{ textDecoration: "none" }}>
          <ListItem onClick={toggleDrawer(false)}>
            <ListItemButton>
              <ListItemIcon>
                <ForumIcon />
              </ListItemIcon>
              <ListItemText primary={"Doubts"} />
            </ListItemButton>
          </ListItem>
        </NavLink>
      </List>
      <Divider />
    </Box>
  );

  const modalStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    border: "none",
  };
  return (
    <>
      <Box
        sx={{
          flexGrow: 2,
          position: "sticky",
          top: 0,
          backgroundColor: "#987458",
          zIndex: 10,
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: "#fafafa" }}>
          <Toolbar>
            <IconButton
              onClick={toggleDrawer(true)}
              size="large"
              edge="start"
              color="black"
              aria-label="menu"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <NavLink to="/" className=" text-decoration-none">
                E-ClassRoom
              </NavLink>
            </Typography>
            {isLoggedIn ? (
              <div>
                <MenuItem sx={{ color: "#000" }} onClick={handleLogoutUser}>
                  Logout
                </MenuItem>
              </div>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: 100,
                }}
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
      <Modal open={showUserPage} onClose={handleshowUserPage}>
        <Box sx={style}>
          <AuthPage handleshowUserPage={handleshowUserPage} />
          <hr />
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleshowUserPage}
            sx={{ position: "fixed", right: 10, bottom: 10 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Navbar;
