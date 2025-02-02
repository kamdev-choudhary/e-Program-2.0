import React from "react";
import {
  Alert,
  CircularProgress,
  IconButton,
  Slide,
  Fade,
} from "@mui/material";
import useOnlineStatus from "../utils/useOnlineStatus";
import { RefreshRounded } from "@mui/icons-material";

const OnlineStatusIndicator: React.FC = () => {
  const { online, fetchStatus, loading } = useOnlineStatus();

  return (
    <>
      <Fade in={!online} timeout={500}>
        <Slide direction="up" in={!online} mountOnEnter unmountOnExit>
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
            severity={online ? "success" : "error"}
            action={
              <>
                {!online && (
                  <IconButton onClick={fetchStatus}>
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RefreshRounded />
                    )}
                  </IconButton>
                )}
              </>
            }
          >
            Backend is online. Everything is working fine!
          </Alert>
        </Slide>
      </Fade>
    </>
  );
};

export default OnlineStatusIndicator;
