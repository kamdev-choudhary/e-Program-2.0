import {
  Box,
  Button,
  Checkbox,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants/helper";
import { useGlobalProvider } from "../../GlobalProvider";

function LoginPage({ setShowAuthPage, setSelectedAuthPage }) {
  const { handleLogin } = useGlobalProvider();
  const [user, setUser] = useState({
    id: "",
    password: "",
  });

  const handleLoginButton = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        ...user,
      });
      handleLogin(response);
      if (response.data.status_code === 1) {
        setShowAuthPage(false);
      }
    } catch (error) {
      console.error(error);
    }
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
        <TextField
          value={user?.id}
          onChange={
            (e) => setUser((prev) => ({ ...prev, id: e.target.value })) // Ensure correct spreading
          }
          label="Email/Mobile"
          sx={{ minWidth: 350 }}
        />
        <TextField
          value={user?.password}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, password: e.target.value }))
          }
          label="Password"
          sx={{ minWidth: 350 }}
          type="password"
        />
        <Box>
          <Checkbox />
          Remember me
        </Box>
        <Button variant="contained" onClick={handleLoginButton}>
          Login
        </Button>
        <Button
          onClick={() => setSelectedAuthPage("register")}
          color="secondary"
          style={{ textDecoration: "none" }}
        >
          Don't have an Account? Sign Up.
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
