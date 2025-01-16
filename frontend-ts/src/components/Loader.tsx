import { Backdrop, Box, Typography } from "@mui/material";
import React from "react";
import { MoonLoader } from "react-spinners";

interface LoaderProps {
  open?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ open }) => {
  return (
    <Backdrop
      open={open || true}
      sx={{
        zIndex: 15000,
        backdropFilter: "blur(5px)", // Adjust the blur level here
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add some transparency to the background
      }}
    >
      <Box>
        <MoonLoader speedMultiplier={0.5} color="#fff" />
        <Typography sx={{ mt: 1, color: "#fff" }}>Please wait ...</Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
