import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

function LoginPage() {
  const [user, setUser] = useState({
    id: "",
    password: "",
  });

  const handleLogin = async () => {
    console.log("login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        h: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          columnGap: 1,
          rowGap: 2,
          p: 4,
        }}
        component={Paper}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Login</Typography>
        </Box>
        <TextField label="Username/Email/Mobile" sx={{ minWidth: 350 }} />
        <TextField label="Password" sx={{ minWidth: 350 }} />
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
        <Typography
          component="a"
          href="/signup"
          variant="body1"
          color="primary"
          style={{ textDecoration: "none" }}
        >
          Don't have an Account? Sign Up.
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
