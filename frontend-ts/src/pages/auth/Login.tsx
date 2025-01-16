import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import axios from "../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { useDispatch } from "react-redux";

interface User {
  id: string;
  password: string;
}

interface LoginProps {
  setActiveTab: (value: number) => void;
}

const Login: React.FC<LoginProps> = ({ setActiveTab }) => {
  const { handleUserLogin } = useGlobalContext();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>({
    id: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", user);
      if (response.status === 200) {
        handleUserLogin(response.data);
        dispatch({ type: "SET_AUTHPAGE", payload: false });
      }
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={user.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={user.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            autoComplete=""
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ mt: 1 }}>Don't have an account. </Typography>
          <Button onClick={() => setActiveTab(1)}>Sign up</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
