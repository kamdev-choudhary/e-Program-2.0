import React, { ReactNode } from "react";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch } from "react-redux";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { isLoggedIn, user } = useGlobalContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = user?.role ?? ""; // Ensure userRole is always a string

  // ✅ Allow public access without restrictions
  if (allowedRoles.includes("public")) {
    return <>{children}</>;
  }

  // ✅ Redirect unauthenticated users and set the auth page state
  if (!isLoggedIn) {
    dispatch({ type: "SET_AUTHPAGE", payload: true });
  }

  // ✅ Grant access if user has a valid role
  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  // ❌ Unauthorized access: Show a proper UI
  return (
    <Box
      component={Paper}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 2,
        flexGrow: 1,
        height: "100%",
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        403
      </Typography>
      <Typography variant="h5" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        You do not have permission to view this page. Please contact your
        administrator if you believe this is a mistake.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 3 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ProtectedRoute;
