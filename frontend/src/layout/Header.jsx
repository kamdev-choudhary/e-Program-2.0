import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  Divider,
  Button,
  Card,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  MenuOpenRounded,
  MenuRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { useGlobalProvider } from "../GlobalProvider";
import { BrandName } from "../constants/helper";
// import UpdatePassword from "../pages/auth/UpdatePassword";
import { CustomModal } from "../components/CustomModal";
import { useMediaQuery } from "@mui/material";

const Header = ({ handleButtonClick, expanded }) => {
  const {
    logoutUser,
    deviceTheme,
    setDeviceTheme,
    user,
    scholarDetails,
    isLoggedIn,
  } = useGlobalProvider();
  const isSmallScreen = useMediaQuery("(max-width:500px)");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [themeMenuEl, setThemeMenuEl] = useState(null);
  const openThemeMenu = Boolean(themeMenuEl);

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

  const handleThemeChange = (theme) => {
    setDeviceTheme(theme);
    handleMenuClose();
  };

  return (
    <Toolbar>
      <IconButton
        aria-label="open drawer"
        onClick={handleButtonClick}
        edge="start"
        sx={{ mr: 1, bgcolor: "background.hover" }}
      >
        {expanded ? <MenuOpenRounded /> : <MenuRounded />}
      </IconButton>
      <img src={BrandName} alt="Brand Logo" height={25} />
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
          {/* Light Mode Card */}
          <Card
            onClick={() => handleThemeChange("light")}
            sx={{
              width: "100%",
              height: "150px",
              boxShadow: 3,
              cursor: "pointer",
              "&:hover": {
                boxShadow: 6,
              },
              mb: 2,
              bgcolor: "white",
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{ mt: 2, color: "#000" }}
            >
              Light Mode
            </Typography>
          </Card>

          {/* Dark Mode Card */}
          <Card
            onClick={() => handleThemeChange("dark")}
            sx={{
              width: "100%",
              height: "150px",
              boxShadow: 3,
              cursor: "pointer",
              "&:hover": {
                boxShadow: 6,
              },
              mb: 2,
              bgcolor: "grey",
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{ mt: 2, color: "#fff" }}
            >
              Dark Mode
            </Typography>
            <Box
              sx={{
                height: "80%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              {/* Dark Mode Skeleton */}
            </Box>
          </Card>
          <Card>
            <Typography sx={{ p: 2 }}>Primary Color</Typography>
            <Divider />
            <Box></Box>
          </Card>
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
          <Button sx={{ mr: 1 }} variant="contained">
            Login
          </Button>
          <Button color="secondary" variant="contained">
            Sign Up
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
        {user?.id_role === "5" && <Divider sx={{ my: 1 }} />}
        {user?.id_role === "5" && (
          <Box
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "column",
              m: 1,
              mb: 2,
              rowGap: 1,
            }}
          >
            <Typography>CoE: {scholarDetails?.coe_name}</Typography>
            <Typography>Batch: {scholarDetails?.batch_name}</Typography>
            <Typography>Section: {scholarDetails?.section_name}</Typography>
            <Typography>Address: {scholarDetails?.address}</Typography>
          </Box>
        )}
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
    </Toolbar>
  );
};

export default Header;
