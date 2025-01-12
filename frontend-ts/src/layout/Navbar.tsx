import React, { useState } from "react";
import { Box, Button, MenuItem, Menu } from "@mui/material";
import { buttons } from "./buttons";
import { ArrowDropDownRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { RootState } from "../store/store";
import { CustomModal } from "../components/CustomModal";
import UpdatePassword from "./UpdatePassword";

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
      <Box sx={{ display: "flex", gap: 1 }}>
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
              onClick={(event) => handleMenuOpen(-1, event)} // Separate menu state for user dropdown
              variant="outlined"
              endIcon={<ArrowDropDownRounded />}
            >
              {user?.name}
            </Button>
            <Menu
              anchorEl={menuStates[-1] || null}
              open={Boolean(menuStates[-1])}
              onClose={() => handleMenuClose(-1)}
            >
              <MenuItem
                onClick={() => navigate("/profile")}
                sx={{ minWidth: 200 }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() =>
                  dispatch({ type: "SET_FORGOTPASSWORD", payload: true })
                }
              >
                Update Password
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            onClick={() =>
              isLoggedIn
                ? handleLogout()
                : dispatch({ type: "SET_AUTHPAGE", payload: true })
            }
          >
            {isLoggedIn ? "Logout" : "Login"}
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
