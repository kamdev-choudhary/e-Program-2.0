import React, { createContext, ReactNode, useContext, useState } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

// Define the NotificationContext
interface NotificationContextType {
  showNotification: (options: {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    variant?: "filled" | "outlined" | "standard";
  }) => void;
  hideNotification: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
  variant: "filled" | "outlined" | "standard";
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
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        action={actions}
        sx={{ minWidth: 250 }}
        severity={type}
        variant={variant}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// NotificationProvider to wrap your app
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "warning" | "info">(
    "success"
  );
  const [variant, setVariant] = useState<"filled" | "outlined" | "standard">(
    "standard"
  );

  const showNotification = ({
    message,
    type = "success",
    variant = "standard",
  }: {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    variant?: "filled" | "outlined" | "standard";
  }) => {
    setMessage(message);
    setType(type);
    setVariant(variant);
    setOpen(true);
  };

  const hideNotification = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      <Notification
        open={open}
        message={message}
        type={type}
        variant={variant}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

// Custom hook to use the showNotification function
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
