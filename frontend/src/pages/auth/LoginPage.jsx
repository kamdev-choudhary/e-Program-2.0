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
import { useDispatch } from "react-redux";

function LoginPage({ setSelectedAuthPage }) {
  const { handleLogin, isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState({
    id: "",
    password: "",
  });

  const handleLoginButton = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/auth/login`, {
        ...user,
      });
      if (isValidResponse(response)) {
        handleLogin(response);
        dispatch({ type: "SET_AUTHPAGE", payload: false });
      } else {
        setLoginError(response?.data?.message);
      }
    } catch (error) {
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
          onChange={(e) => {
            setUser((prev) => ({ ...prev, id: e.target.value }));
            setLoginError("");
          }}
          label="Email/Mobile"
          sx={{ minWidth: 350 }}
          error={!!loginError}
          helperText={loginError}
        />
        <TextField
          value={user?.password}
          onChange={(e) => {
            setUser((prev) => ({ ...prev, password: e.target.value }));
            setLoginError("");
          }}
          label="Password"
          sx={{ minWidth: 350 }}
          type="password"
          error={!!loginError}
          helperText={loginError}
        />
        <Box>
          <Checkbox />
          Remember me
        </Box>
        <Button
          disabled={!user?.id || !user?.password}
          variant="contained"
          onClick={handleLoginButton}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSelectedAuthPage("register")}
          color="secondary"
          sx={{ textTransform: "none" }}
        >
          Don't have an Account? Sign Up.
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
