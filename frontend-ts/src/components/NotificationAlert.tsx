import React, { forwardRef } from "react";
import { Alert, AlertProps } from "@mui/material";
import { green, red, yellow, blue, grey } from "@mui/material/colors";

interface NotificationAlertProps extends Omit<AlertProps, "severity"> {
  notification: {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    variant?: "filled" | "outlined" | "standard";
  };
  setNotification: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      type?: "success" | "error" | "warning" | "info";
      variant?: "filled" | "outlined" | "standard";
    }>
  >;
}

// Use React.forwardRef to wrap the component
const NotificationAlert = forwardRef<HTMLDivElement, NotificationAlertProps>(
  ({ notification, ...props }, ref) => {
    const getStyles = (type?: "success" | "error" | "warning" | "info") => {
      switch (type) {
        case "success":
          return { backgroundColor: green[50], borderColor: green[900] };
        case "error":
          return { backgroundColor: red[50], borderColor: red[900] };
        case "warning":
          return { backgroundColor: yellow[50], borderColor: yellow[800] };
        case "info":
          return { backgroundColor: blue[50], borderColor: blue[900] };
        default:
          return { backgroundColor: grey[100], borderColor: grey[400] };
      }
    };

    const { backgroundColor, borderColor } = getStyles(notification.type);

    return (
      <Alert
        ref={ref} // Forward the ref here
        severity={notification.type}
        variant={notification.variant}
        {...props}
        sx={{
          minWidth: 350,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        {notification.message}
      </Alert>
    );
  }
);

export default NotificationAlert;
