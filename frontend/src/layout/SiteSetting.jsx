import { Box, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import CustomSwitch from "../components/CustomSwitch";
import { useGlobalProvider } from "../GlobalProvider";
import dark from "../assets/dark.png";
import light from "../assets/light.png";

function SiteSetting() {
  const { deviceTheme, toggleTheme } = useGlobalProvider();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
        <Typography>Change Theme</Typography>
      </Box>
      <Box onClick={toggleTheme} sx={{ cursor: "pointer" }}>
        <img
          src={deviceTheme === "dark" ? light : dark}
          width="100%"
          alt="Theme Icon"
          style={{ borderRadius: 10 }}
        />
      </Box>
    </Box>
  );
}

export default SiteSetting;
