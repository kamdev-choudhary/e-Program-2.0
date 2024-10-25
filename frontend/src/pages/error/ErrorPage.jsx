import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      padding={3}
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        It seems you’ve stumbled upon a page that isn’t available.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")} // Redirect to home
        sx={{ marginTop: 2 }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
