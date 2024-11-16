import { Box, Divider, TextField, Typography } from "@mui/material";
import React from "react";
import { useGlobalProvider } from "../GlobalProvider";
import dark from "../assets/dark.png";
import light from "../assets/light.png";

function SiteSetting() {
  const { deviceTheme, toggleTheme } = useGlobalProvider();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
        <Typography>Themes</Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box
        onClick={toggleTheme}
        sx={{ cursor: "pointer", display: "flex", columnGap: 2 }}
      >
        <Box
          sx={{
            flex: 1,
            p: 0.5,
            ...(deviceTheme === "dark" && {
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: 2,
            }),
          }}
        >
          <img
            src={dark}
            width="100%"
            alt="Theme Icon"
            style={{ borderRadius: 10 }}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>Dark Theme</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 0.5,
            ...(deviceTheme === "light" && {
              border: "2px solid rgba(0,0,0,0.4)",
              borderRadius: 2,
            }),
          }}
        >
          <img
            src={light}
            width="100%"
            alt="Theme Icon"
            style={{ borderRadius: 10 }}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>Light Theme</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
        <Typography>Colors</Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box sx={{ display: "flex", p: 1 }}>
        <TextField label="Primary Color" fullWidth type="color" />
      </Box>
    </Box>
  );
}

export default SiteSetting;
