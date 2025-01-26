import React from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

interface NotificationProps {
  open: boolean;
  message?: string;
  type?: "success" | "error" | "warning" | "info";
  variant?: "filled" | "outlined" | "standard";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  type,
  variant,
  onClose,
}) => {
  const actions = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={onClose}
    >
      <CloseRounded />
    </IconButton>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      action={actions}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        sx={{ minWidth: 250 }}
        severity={type || "success"}
        variant={variant || "standard"}
      >
        {message || "Default Notification Message"}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
