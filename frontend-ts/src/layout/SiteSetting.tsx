import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import dark from "../assets/dark.png";
import light from "../assets/light.png";
import useTheme from "../utils/useTheme";

const SiteSetting: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Themes
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            columnGap: 2,
            flexWrap: "wrap",
          }}
        >
          {/** Dark Theme Box */}
          <Box
            sx={{
              flex: 1,
              p: 0.5,
              border: "2px solid transparent", // Default transparent border
              borderRadius: 2,
              ...(theme === "dark" && {
                borderColor: "rgba(255,255,255,0.6)", // Highlight for selected theme
              }),
              boxSizing: "border-box", // Ensures consistent sizing
            }}
            onClick={() => toggleTheme("dark")}
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
          {/** Light Theme Box */}
          <Box
            sx={{
              flex: 1,
              p: 0.5,
              border: "2px solid transparent", // Default transparent border
              borderRadius: 2,
              ...(theme === "light" && {
                borderColor: "rgba(0,0,0,0.4)", // Highlight for selected theme
              }),
              boxSizing: "border-box", // Ensures consistent sizing
            }}
            onClick={() => toggleTheme("light")}
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
      </Box>
    </Box>
  );
};

export default SiteSetting;
