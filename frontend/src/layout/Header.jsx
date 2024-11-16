import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  MenuOpenRounded,
  MenuRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { useGlobalProvider } from "../GlobalProvider";
// import UpdatePassword from "../pages/auth/UpdatePassword";
import { CustomModal } from "../components/CustomModal";
import { useMediaQuery } from "@mui/material";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ScrollableTabs from "../components/ScrollableTabs";
import { icons } from "../constants/helper";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SiteSetting from "./SiteSetting";

const Header = ({ handleButtonClick, expanded }) => {
  const { logoutUser, photo, user, isLoggedIn } = useGlobalProvider();
  const authPage = useSelector((state) => state.authPage);
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width:500px)");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [themeMenuEl, setThemeMenuEl] = useState(null);
  const openThemeMenu = Boolean(themeMenuEl);
  const [selectedAuthPage, setSelectedAuthPage] = useState("login");
  const navigate = useNavigate();

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setThemeMenuEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClick = (event) => {
    setThemeMenuEl(event.currentTarget);
  };

  return (
    <Toolbar>
      <IconButton
        aria-label="open drawer"
        onClick={handleButtonClick}
        edge="start"
        sx={{ mr: 1, bgcolor: "background.paper" }}
      >
        {expanded ? <MenuOpenRounded /> : <MenuRounded />}
      </IconButton>
      {/* <img src={BrandName} alt="Brand Logo" height={25} /> */}
      <Typography
        component="a"
        variant="h6"
        sx={{
          fontWeight: 700,
          cursor: "pointer",
          ":hover": {
            color: "#aaa",
          },
        }}
        onClick={() => navigate("/")}
      >
        E-Program
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton aria-label="change theme" onClick={handleThemeMenuClick}>
        <SettingsRounded />
      </IconButton>

      <Menu
        anchorEl={themeMenuEl}
        open={openThemeMenu}
        onClose={handleMenuClose}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            padding: 2,
            width: 350,
            flexDirection: "column",
          }}
        >
          <SiteSetting />
        </Box>
      </Menu>

      <IconButton
        sx={{ mx: 1 }}
        aria-label="fullscreen"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
      {isLoggedIn ? (
        <IconButton aria-label="user menu" onClick={handleMenuClick}>
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/3d-fluency/94/user-male-circle.png"
            alt="User Avatar"
          />
        </IconButton>
      ) : (
        <Box>
          <Button
            onClick={() => dispatch({ type: "SET_AUTHPAGE", payload: true })}
            sx={{ mr: 1 }}
            variant="contained"
          >
            Login / Sign Up
          </Button>
        </Box>
      )}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <Box
          sx={{
            px: 2,
            display: "flex",
            flexDirection: "column",
            m: 1,
            mb: 1,
            rowGap: 1,
          }}
        >
          <Typography>Name: {user?.name}</Typography>
          <Typography>Email: {user?.email}</Typography>
          <Typography>Mobile: {user?.mobile}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            px: 2,
            display: "flex",
            mb: 1,
            flexDirection: "column",
            rowGap: 1,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/profile")}
          >
            Profile
          </Button>
          <Button
            onClick={() => {
              handleMenuClose();
              setShowUpdatePassword(true);
            }}
            variant="contained"
            color="secondary"
          >
            Update Password
          </Button>
          <Button fullWidth variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>
      <CustomModal
        width="400px"
        open={showUpdatePassword}
        onClose={() => setShowUpdatePassword(false)}
        header="Update Password"
        height="auto"
      >
        {/* <UpdatePassword onSuccess={() => setShowUpdatePassword(false)} /> */}
      </CustomModal>

      <CustomModal
        open={authPage}
        showFullScreenButton={false}
        height="auto"
        width="auto"
        header=""
        onClose={() => dispatch({ type: "SET_AUTHPAGE", payload: false })}
      >
        <Box sx={{ mb: 2 }}>
          <ScrollableTabs
            tabs={[
              { name: "Login", value: "login", icon: icons.login },
              {
                name: "Register",
                value: "register",
                icon: icons.register,
              },
            ]}
            selectedTab={selectedAuthPage}
            setSelectedTab={setSelectedAuthPage}
          />
        </Box>
        {selectedAuthPage === "login" ? (
          <LoginPage setSelectedAuthPage={setSelectedAuthPage} />
        ) : (
          <SignUpPage setSelectedAuthPage={setSelectedAuthPage} />
        )}
      </CustomModal>
    </Toolbar>
  );
};

export default Header;
