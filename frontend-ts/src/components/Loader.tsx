import React from "react";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

interface LoaderProps {
  open?: boolean; // Optional, default is false
}

const Loader: React.FC<LoaderProps> = ({ open = true }) => {
  const [dotCount, setDotCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // Cycles through 0,1,2,3
    }, 500); // Adjust the timing as needed

    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(dotCount);

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
          Please wait{dots}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
