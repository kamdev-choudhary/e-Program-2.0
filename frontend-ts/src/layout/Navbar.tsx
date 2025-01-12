import { Box, Button, MenuItem, Menu } from "@mui/material";
import React, { useState } from "react";
import { buttons } from "./buttons";
import { ArrowDropDownRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGlobalContext } from "../contexts/GlobalProvider";

interface ButtonProps {
  label: string;
  path?: string;
  icon: React.ElementType;
  type: "button" | "menu";
  color?: string;
  size?: number;
  options?: { label: string; path: string }[];
  loginRequired?: boolean;
}

const CustomButton: React.FC<{
  button: ButtonProps;
  handleButtonClick: (button: ButtonProps) => void;
}> = ({ button, handleButtonClick }) => {
  return (
    <Button
      onClick={() => handleButtonClick(button)}
      startIcon={<button.icon sx={{ fontSize: button.size }} />}
    >
      {button.label}
    </Button>
  );
};

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, handleLogout, user } = useGlobalContext();

  console.log(user);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNameClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleButtonClick = (button: ButtonProps) => {
    if (button.path) {
      navigate(button.path);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: 67,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        bgcolor: "#fff",
        px: 3,
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        {buttons?.map((button, index) => {
          if (button.loginRequired && !isLoggedIn) return;
          if (button.type === "button") {
            return (
              <CustomButton
                key={index}
                button={button}
                handleButtonClick={handleButtonClick}
              />
            );
          } else if (button.type === "menu" && button.options) {
            return (
              <React.Fragment key={index}>
                <Button
                  endIcon={<ArrowDropDownRounded />}
                  onClick={handleMenuClick}
                >
                  {button.label}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                >
                  {button.options.map((option, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleCloseMenu();
                        navigate(option.path);
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </React.Fragment>
            );
          }
          return null;
        })}
      </Box>

      <Box>
        {isLoggedIn ? (
          <>
            <Button
              onClick={handleNameClick}
              variant="outlined"
              endIcon={<ArrowDropDownRounded />}
            >
              {user?.name}
            </Button>
            <Menu
              anchorEl={anchorEl2}
              open={Boolean(anchorEl2)}
              onClose={handleCloseMenu}
            >
              <MenuItem sx={{ minWidth: 200 }}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            onClick={() => {
              isLoggedIn
                ? handleLogout()
                : dispatch({ type: "SET_AUTHPAGE", payload: true });
            }}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
