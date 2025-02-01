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
} from "@mui/material";
import {
  MenuOpenRounded,
  MenuRounded,
  LogoutRounded,
  PinRounded,
  AccountBoxRounded,
  LockRounded,
} from "@mui/icons-material";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DummyImageUrl from "../assets/user.jpg";
import ThemeSwitch from "../components/ThemeSwitch";
import SearchBar from "./Searchbar";
import { RootState } from "../store/store";

interface HeaderProps {
  handleButtonClick: () => void;
  expanded: boolean;
  isSmallScreen: boolean;
}

const Appbar: React.FC<HeaderProps> = React.memo(
  ({ handleButtonClick, expanded, isSmallScreen }) => {
    const { user, handleLogout, isLoggedIn, profilePicUrl } =
      useGlobalContext();
    const theme = useSelector((state: RootState) => state.theme);
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

    const menuContentStyles = {
      px: { xs: 0, sm: 2 },
      display: "flex",
      flexDirection: "column",
      rowGap: 1,
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
              display: { xs: "none", md: "flex" },
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

          {!isSmallScreen && (
            <Box sx={{ mr: 2 }}>
              <SearchBar />
            </Box>
          )}

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
              size="small"
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
            <Box sx={{ ...menuContentStyles, mb: 1 }}>
              <Typography>Name: {user?.name || "Guest"}</Typography>
              <Typography>Email: {user?.email || "N/A"}</Typography>
              <Typography>Mobile: {user?.mobile || "N/A"}</Typography>
            </Box>
            <Divider />
            <Box sx={{ ...menuContentStyles, mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleProfileClick}
                startIcon={<AccountBoxRounded />}
              >
                Profile
              </Button>
              <Button
                startIcon={<PinRounded />}
                onClick={handleUpdatePasswordClick}
                variant="contained"
                color="secondary"
              >
                Update Password
              </Button>
              <Button
                startIcon={<LogoutRounded />}
                fullWidth
                variant="outlined"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
);

export default Appbar;
