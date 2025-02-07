import React from "react";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

interface LoaderProps {
  open?: boolean; // Optional, default is false
}

const Loader: React.FC<LoaderProps> = ({ open = true }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1, // Ensures loader is above all components
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(5px)", // Blurred background
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress size={50} sx={{ color: "#fff" }} />
        <Typography sx={{ mt: 2, color: "#fff", fontWeight: 500 }}>
          Please wait...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
