import { Box, Typography } from "@mui/material";
import React from "react";
import CustomSwitch from "../components/CustomSwitch";
import { useGlobalProvider } from "../GlobalProvider";
import dark from "../assets/dark.png";
import light from "../assets/light.png";

function SiteSetting() {
  const { deviceTheme, toggleTheme } = useGlobalProvider();

  return (
    <Box>
      <Box onClick={toggleTheme} sx={{ cursor: "pointer" }}>
        <img
          src={deviceTheme === "dark" ? light : dark}
          width="100%"
          alt="Theme Icon"
        />
      </Box>
      <Box></Box>
    </Box>
  );
}

export default SiteSetting;
