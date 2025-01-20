import React from "react";
import { Box, LinearProgress } from "@mui/material";
import useOnlineStatus from "../utils/useOnlineStatus";

const OnlineStatusIndicator: React.FC = () => {
  const { online, loading } = useOnlineStatus();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 100,
        width: "100vw",
      }}
    >
      <LinearProgress
        color={online ? "success" : "error"}
        value={loading ? undefined : 100}
        variant={loading ? "indeterminate" : "determinate"}
      />
    </Box>
  );
};

export default OnlineStatusIndicator;
