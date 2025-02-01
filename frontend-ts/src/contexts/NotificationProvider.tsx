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

// NotificationProvider to wrap your app
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
    variant: "filled" | "outlined" | "standard";
  }>({
    open: false,
    message: "",
    type: "success",
    variant: "standard",
  });

  const showNotification = ({
    message,
    type = "success",
    variant = "standard",
  }: {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    variant?: "filled" | "outlined" | "standard";
  }) => {
    setNotification({ open: true, message, type, variant });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={hideNotification}
            >
              <CloseRounded />
            </IconButton>
          }
          sx={{ minWidth: 250 }}
          severity={notification.type}
          variant={notification.variant}
        >
          {notification.message}
        </Alert>
      </Snackbar>
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
