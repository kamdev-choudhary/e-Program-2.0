import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); // Redirect to the home page or any route you define
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "background.paper", // Optional background color
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
        onClick={handleBackToHome}
        sx={{ mt: 3 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
