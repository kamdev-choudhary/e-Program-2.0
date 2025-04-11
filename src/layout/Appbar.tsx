import React, { useState, useCallback } from "react";
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
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MenuOpenRounded,
  MenuRounded,
  LogoutRounded,
  AccountBoxRounded,
  LockRounded,
  LockResetRounded,
  AccountCircleRounded,
  EmailRounded,
  PhoneRounded,
} from "@mui/icons-material";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DummyImageUrl from "../assets/user.jpg";
import ThemeSwitch from "../components/ThemeSwitch";
import { useAppTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  handleButtonClick: () => void;
  expanded: boolean;
  isSmallScreen: boolean;
}

const Appbar: React.FC<HeaderProps> = React.memo(
  ({ handleButtonClick, expanded }) => {
    const { user, handleLogout, isLoggedIn, profilePicUrl } =
      useGlobalContext();
    const { theme } = useAppTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const openMenu = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMenuClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleMenuClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      },
      []
    );

    const handleProfileClick = useCallback(() => {
      handleMenuClose();
      navigate("/profile");
    }, [handleMenuClose, navigate]);

    const handleUpdatePasswordClick = useCallback(() => {
      dispatch({ type: "SET_FORGOTPASSWORD", payload: true });
      handleMenuClose();
    }, [dispatch, handleMenuClose]);

    const handleLogoutClick = useCallback(() => {
      handleLogout();
      handleMenuClose();
    }, [handleLogout, handleMenuClose]);

    const handleLoginClick = useCallback(() => {
      dispatch({ type: "SET_AUTHPAGE", payload: true });
    }, [dispatch]);

    const appBarStyles = {
      height: "67px",
      justifyContent: "center",
      borderRadius: 0,
      m: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };

    return (
      <AppBar sx={appBarStyles} position="static">
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

          <Box
            sx={{
              mr: 2,
              display: "flex",
              flexGrow: 1,
              zIndex: 100,
            }}
          >
            <Typography
              sx={{ color: theme === "dark" ? "white" : "black" }}
              variant="h5"
            >
              e-Program
            </Typography>
          </Box>

          <ThemeSwitch />

          {isLoggedIn ? (
            <IconButton aria-label="user menu" onClick={handleMenuClick}>
              <Avatar
                sx={{ width: 35, height: 35 }}
                src={profilePicUrl || DummyImageUrl}
              />
            </IconButton>
          ) : (
            <Button
              onClick={handleLoginClick}
              variant="outlined"
              startIcon={<LockRounded />}
              aria-label="login"
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
            <Box sx={{ p: 1.2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Account Details
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <AccountCircleRounded
                  sx={{ color: "action.active", fontSize: 20 }}
                />
                <Typography variant="body2">{user?.name || "Guest"}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <EmailRounded sx={{ color: "action.active", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {user?.email || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneRounded sx={{ color: "action.active", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {user?.mobile || "N/A"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleProfileClick}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon>
                <AccountBoxRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile Settings</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={handleUpdatePasswordClick}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon>
                <LockResetRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleLogoutClick}
                startIcon={<LogoutRounded />}
                sx={{
                  justifyContent: "flex-start",
                  pl: 2.5,
                  py: 1,
                  borderRadius: 1,
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-1px)" },
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
);

export default Appbar;
