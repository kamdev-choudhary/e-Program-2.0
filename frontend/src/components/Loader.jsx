import { Backdrop, Box, Typography } from "@mui/material";
import React from "react";
import { MoonLoader } from "react-spinners";

function Loader({ open }) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1500,
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
}

export default Loader;
