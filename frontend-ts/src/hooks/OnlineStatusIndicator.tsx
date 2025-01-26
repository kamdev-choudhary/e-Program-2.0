import React from "react";
import { Alert, CircularProgress, IconButton } from "@mui/material";
import useOnlineStatus from "../utils/useOnlineStatus";
import { RefreshRounded } from "@mui/icons-material";

const OnlineStatusIndicator: React.FC = () => {
  const { online, fetchStatus, loading } = useOnlineStatus();

  return (
    <>
      {!online && (
        <Alert
          sx={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 20px",
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 100,
            minWidth: 340,
          }}
          severity="error"
          action={
            <>
              <IconButton onClick={fetchStatus} size="small">
                {loading ? <CircularProgress size={20} /> : <RefreshRounded />}
              </IconButton>
            </>
          }
        >
          Backend is offline. Try after some time
        </Alert>
      )}
    </>
  );
};

export default OnlineStatusIndicator;
