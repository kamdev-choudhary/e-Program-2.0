import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  Button,
  Avatar,
  AppBar,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  MenuOpenRounded,
  MenuRounded,
  LogoutRounded,
  PinRounded,
  AccountBoxRounded,
  LockRounded,
} from "@mui/icons-material";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DummyImageUrl from "../assets/user.jpg";
import ThemeSwitch from "../components/ThemeSwitch";

interface HeaderProps {
  handleButtonClick: () => void;
  expanded: boolean;
}

const Header: React.FC<HeaderProps> = ({ handleButtonClick, expanded }) => {
  const { user, handleLogout, isLoggedIn, profilePicUrl } = useGlobalContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enable fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit fullscreen mode:", err);
      });
    }
    setIsFullscreen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar
      sx={{
        height: "67px", // Set the AppBar height
        justifyContent: "center",
        borderRadius: 0,
        m: 0,
      }}
      position="static"
    >
      <Toolbar
        sx={{
          minHeight: "67px", // Adjust the Toolbar height to match AppBar
        }}
      >
        <IconButton
          size="large"
          edge="start"
          aria-label="toggle menu"
          sx={{ mr: 1 }}
          onClick={handleButtonClick}
        >
          {expanded ? <MenuOpenRounded /> : <MenuRounded />}
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          e-Program
        </Typography>

        <ThemeSwitch />

        <IconButton
          sx={{ mx: 1 }}
          aria-label={isFullscreen ? "exit fullscreen" : "enter fullscreen"}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>

        {isLoggedIn ? (
          <IconButton aria-label="user menu" onClick={handleMenuClick}>
            <Avatar
              sx={{ width: 35, height: 35 }}
              src={profilePicUrl || DummyImageUrl}
            />
          </IconButton>
        ) : (
          <Button
            onClick={() => dispatch({ type: "SET_AUTHPAGE", payload: true })}
            variant="outlined"
            startIcon={<LockRounded />}
            aria-label="login"
          >
            Login
          </Button>
        )}

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
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
            <Typography>Name: {user?.name || "Guest"}</Typography>
            <Typography>Email: {user?.email || "N/A"}</Typography>
            <Typography>Mobile: {user?.mobile || "N/A"}</Typography>
          </Box>
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
              variant="contained"
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
              startIcon={<AccountBoxRounded />}
            >
              Profile
            </Button>
            <Button
              startIcon={<PinRounded />}
              onClick={handleMenuClose}
              variant="contained"
              color="secondary"
            >
              Update Password
            </Button>
            <Button
              startIcon={<LogoutRounded />}
              fullWidth
              variant="outlined"
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              Logout
            </Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
