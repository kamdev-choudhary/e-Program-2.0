import React from "react";
import { Card, Typography } from "@mui/material";
import useOnlineStatus from "../utils/useOnlineStatus";

const OnlineStatusIndicator: React.FC = () => {
  const { online } = useOnlineStatus();

  return (
    <>
      {!online && (
        <Card
          sx={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 182, 193, 0.9)", // Light red with transparency
            border: "2px solid darkred", // Dark red border
            color: "darkred", // Dark red text
            padding: "10px 18px",
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 100,
          }}
        >
          <Typography variant="body2" align="center">
            Backend is Offline. Kindly try after some time.
          </Typography>
        </Card>
      )}
    </>
  );
};

export default OnlineStatusIndicator;
