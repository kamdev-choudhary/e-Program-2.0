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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useGlobalContext();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
        justifyContent: "center",
        gap: 2,
        bgcolor: "#fff",
      }}
    >
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

      <Button onClick={() => dispatch({ type: "SET_AUTHPAGE", payload: true })}>
        Login
      </Button>
    </Box>
  );
};

export default Navbar;
