import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Menu,
  IconButton,
  Avatar,
  MenuList,
  Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { buttons } from "./buttons";
import { ArrowDropDownRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { RootState } from "../store/store";
import { CustomModal } from "../components/CustomModal";
import UpdatePassword from "./UpdatePassword";
import PersonIcon from "@mui/icons-material/Person";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";

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
}> = ({ button, handleButtonClick }) => (
  <Button
    onClick={() => handleButtonClick(button)}
    startIcon={<button.icon sx={{ fontSize: button.size }} />}
  >
    {button.label}
  </Button>
);

const Navbar: React.FC = () => {
  const [menuStates, setMenuStates] = useState<
    Record<number, HTMLElement | null>
  >({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, handleLogout, user } = useGlobalContext();

  const showForgotPassword = useSelector(
    (state: RootState) => state.showForgotPassword
  );

  const handleMenuOpen = (
    index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setMenuStates((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleMenuClose = (index: number) => {
    setMenuStates((prev) => ({ ...prev, [index]: null }));
  };

  const handleButtonClick = (button: ButtonProps) => {
    if (button.path) navigate(button.path);
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
      <Box sx={{ display: "flex", gap: 2 }}>
        {buttons?.map((button, index) => {
          if (button.loginRequired && !isLoggedIn) return null;

          if (button.type === "button") {
            return (
              <CustomButton
                key={index}
                button={button}
                handleButtonClick={handleButtonClick}
              />
            );
          }

          if (button.type === "menu" && button.options) {
            return (
              <React.Fragment key={index}>
                <Button
                  startIcon={<button.icon />}
                  endIcon={<ArrowDropDownRounded />}
                  onClick={(event) => handleMenuOpen(index, event)}
                >
                  {button.label}
                </Button>
                <Menu
                  anchorEl={menuStates[index] || null}
                  open={Boolean(menuStates[index])}
                  onClose={() => handleMenuClose(index)}
                >
                  {button.options.map((option, optionIndex) => (
                    <MenuItem
                      key={optionIndex}
                      onClick={() => {
                        handleMenuClose(index);
                        navigate(option.path);
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {/* Render the icon dynamically */}
                        {option.icon && <option.icon />}
                        {option.label}
                      </Box>
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
            <IconButton onClick={(event) => handleMenuOpen(-1, event)}>
              <Avatar />
            </IconButton>
            <Menu
              anchorEl={menuStates[-1] || null}
              open={Boolean(menuStates[-1])}
              onClose={() => handleMenuClose(-1)}
              sx={{ p: 0 }}
            >
              <MenuList sx={{ p: 0, m: 0 }}>
                {/* User's Name Section */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.name || "User Name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || "user@example.com"}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1 }} />

                {/* Profile Option */}
                <MenuItem onClick={() => navigate("/profile")}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body1">Profile</Typography>
                </MenuItem>

                {/* Update Password Option */}
                <MenuItem
                  onClick={() =>
                    dispatch({ type: "SET_FORGOTPASSWORD", payload: true })
                  }
                >
                  <ListItemIcon>
                    <LockResetIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body1">Update Password</Typography>
                </MenuItem>

                {/* Logout Option */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <Button
            onClick={() => dispatch({ type: "SET_AUTHPAGE", payload: true })}
          >
            Login / Signup
          </Button>
        )}
      </Box>

      <CustomModal
        open={showForgotPassword}
        onClose={() => dispatch({ type: "SET_FORGOTPASSWORD", payload: false })}
        showHeader={false}
        width="auto"
        height="auto"
      >
        <UpdatePassword />
      </CustomModal>
    </Box>
  );
};

export default Navbar;
