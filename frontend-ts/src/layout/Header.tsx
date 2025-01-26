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
  Divider,
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
import SearchBar from "./Searchbar";

interface HeaderProps {
  handleButtonClick: () => void;
  expanded: boolean;
  isSmallScreen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  handleButtonClick,
  expanded,
  isSmallScreen,
}) => {
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
        paddingLeft: 0, // Remove left padding
        paddingRight: 0, // Remove right padding
      }}
      position="static"
    >
      <Toolbar>
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

        {!isSmallScreen && (
          <Box sx={{ mr: 2 }}>
            <SearchBar />
          </Box>
        )}

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
            size="small"
            sx={{ borderRadius: 20 }}
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
              px: { xs: 0, sm: 2 },
              display: "flex",
              flexDirection: "column",
              m: 1,
              mb: 1,
              rowGap: 1,
              minWidth: 250,
            }}
          >
            <Typography>Name: {user?.name || "Guest"}</Typography>
            <Typography>Email: {user?.email || "N/A"}</Typography>
            <Typography>Mobile: {user?.mobile || "N/A"}</Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              px: { xs: 0, sm: 2 },
              display: "flex",
              mb: 1,
              flexDirection: "column",
              rowGap: 1,
              mt: 1,
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
              onClick={() => {
                dispatch({ type: "SET_FORGOTPASSWORD", payload: true });
                handleMenuClose();
              }}
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
