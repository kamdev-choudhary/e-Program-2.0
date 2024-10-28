import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  CancelRounded,
  FullscreenExitRounded,
  FullscreenRounded,
} from "@mui/icons-material";
import { useGlobalProvider } from "../GlobalProvider";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "background.paper",
  border: "1px solid rgba(0,0,0,0.5)",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
};

export const CustomModal = ({
  open = false,
  autoClose = true,
  children,
  header = "",
  onClose,
  height = "90vh",
  width = "80vw",
  showHeader = true,
  showFullScreenButton = false,
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const { deviceTheme } = useGlobalProvider();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Modal
      open={open}
      onClose={() => {
        if (autoClose) onClose();
      }}
    >
      <Box
        sx={{
          ...style,
          width: fullScreen || isSmallScreen ? "99vw" : width,
          height: fullScreen ? "100vh" : height,
          bgcolor: deviceTheme === "light" ? "#f0f3fb" : "#222",
          p: 1,
        }}
      >
        {/* Header section */}
        {showHeader && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1, fontSize: 23 }}>
                {header}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {showFullScreenButton && (
                  <IconButton onClick={() => setFullScreen((prev) => !prev)}>
                    {!isSmallScreen && (
                      <Box>
                        {fullScreen ? (
                          <FullscreenExitRounded />
                        ) : (
                          <FullscreenRounded />
                        )}
                      </Box>
                    )}
                  </IconButton>
                )}
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={onClose}
                  variant="contained"
                  color="error"
                >
                  <CancelRounded />
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
          </>
        )}

        {/* Content section */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: fullScreen
              ? "calc(100vh - 70px)"
              : `calc(${height} - 70px)`,
            p: isSmallScreen ? 0 : 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};
