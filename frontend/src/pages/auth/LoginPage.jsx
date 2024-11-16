import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants/helper";
import { useGlobalProvider } from "../../GlobalProvider";
import { useDispatch } from "react-redux";

function LoginPage({ setSelectedAuthPage }) {
  const { handleLogin, isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState({
    id: "",
    password: "",
  });

  const handleLoginButton = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/auth/login`, {
        ...user,
      });
      if (isValidResponse(response)) {
        handleLogin(response);
        dispatch({ type: "SET_AUTHPAGE", payload: false });
      } else {
        setLoginError(response?.data?.message || "Invalid login credentials");
      }
    } catch (error) {
      setLoginError("An error occurred during login. Please try again.");
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        p: 2,
      }}
      component={Paper}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,

          minWidth: 350,
        }}
        component="form"
        onSubmit={handleLoginButton}
      >
        <Typography variant="h6" align="center">
          Login
        </Typography>
        <TextField
          value={user.id}
          onChange={(e) => {
            setUser((prev) => ({ ...prev, id: e.target.value }));
            setLoginError("");
          }}
          label="Email/Mobile"
          error={!!loginError}
          helperText={loginError}
        />
        <TextField
          value={user.password}
          onChange={(e) => {
            setUser((prev) => ({ ...prev, password: e.target.value }));
            setLoginError("");
          }}
          label="Password"
          type="password"
          error={!!loginError}
          helperText={loginError}
        />
        <FormControlLabel control={<Checkbox />} label="Remember me" />
        <Button
          type="submit"
          disabled={!user.id || !user.password}
          variant="contained"
          fullWidth
        >
          Login
        </Button>
        <Typography
          variant="body2"
          align="center"
          onClick={() => setSelectedAuthPage("register")}
          color="secondary"
          sx={{ cursor: "pointer" }}
        >
          Don't have an account? Sign Up.
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
