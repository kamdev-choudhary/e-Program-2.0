import { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  MenuOpenRounded,
  MenuRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch } from "react-redux";

interface HeaderProps {
  handleButtonClick: () => void;
  expanded: boolean;
}

const Header: React.FC<HeaderProps> = ({ handleButtonClick, expanded }) => {
  const { user, handleLogout, isLoggedIn } = useGlobalContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const openMenu = Boolean(anchorEl);
  const [themeMenuEl, setThemeMenuEl] = useState<any>(null);
  const openThemeMenu = Boolean(themeMenuEl);
  const dispatch = useDispatch();

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuEl(event.currentTarget);
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
      {/* <img src={BrandName} alt="Brand Logo" height={25} /> */}
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
          {/* <SiteSetting /> */}
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
        <>
          <Button
            onClick={() => dispatch({ type: "SET_AUTHPAGE", payload: true })}
            variant="outlined"
          >
            Login / Signup
          </Button>
        </>
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
            }}
            variant="contained"
            color="secondary"
          >
            Update Password
          </Button>
          <Button
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
  );
};

export default Header;
