import { Backdrop, Box, Modal, Typography } from "@mui/material";
import React from "react";
import { MoonLoader } from "react-spinners";
import { useGlobalProvider } from "../GlobalProvider";

function Loader({ open }) {
  const { deviceTheme } = useGlobalProvider();

  return (
    <Backdrop open={open} sx={{ zIndex: 1500 }}>
      <Box
        sx={{
          bgcolor: deviceTheme === "light" ? "#fff" : "#333",
          p: 3.5,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          alignContent: "center",
          columnGap: 2,
          rowGap: 2,
          pt: 5,
        }}
      >
        <MoonLoader speedMultiplier={0.7} color="#4584a8" />
        <Typography sx={{ mt: 1 }}>Please wait ...</Typography>
      </Box>
    </Backdrop>
  );
}

export default Loader;
