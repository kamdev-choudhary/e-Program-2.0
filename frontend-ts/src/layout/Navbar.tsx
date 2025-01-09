import { Box, Button, MenuItem, Menu } from "@mui/material";
import React, { useState } from "react";
import { buttons } from "./buttons";

const CustomButton = ({
  label,
  icon: Icon,
  color = "#000",
}: {
  label: string;
  icon: React.ElementType;
  color: string;
}) => {
  return (
    <Button variant="outlined" startIcon={<Icon sx={{ color: color }} />}>
      {label}
    </Button>
  );
};

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
        if (button.type === "button") {
          return (
            <CustomButton
              key={index}
              label={button.label}
              icon={button.icon}
              color={button.color}
            />
          );
        } else if (button.type === "menu") {
          return (
            <div key={index}>
              <Button onClick={handleMenuClick}>{button.label}</Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                {button.options?.map((option, index) => (
                  <MenuItem key={index} onClick={handleCloseMenu}>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          );
        }
      })}
    </Box>
  );
};

export default Navbar;
