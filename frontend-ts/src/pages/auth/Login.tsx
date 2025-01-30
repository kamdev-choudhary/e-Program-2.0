import {
  Box,
  Typography,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  FilledInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { useDispatch } from "react-redux";
import useSessionDetails from "../../utils/useSessionDetails";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "../../hooks/AxiosInterceptor";
import { useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState<User>({ id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const sessionDetails = useSessionDetails();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/auth/login", {
        user,
        sessionDetails,
      });
      if (response.status === 200) {
        handleUserLogin(response.data);
        dispatch({ type: "SET_AUTHPAGE", payload: false });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.message || "An unexpected error occurred"
      );
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
        flexDirection: "column",
        padding: 2,
        maxWidth: 400,
        margin: "auto",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
        <FormControl fullWidth variant="filled" margin="normal">
          <InputLabel htmlFor="email">Email</InputLabel>
          <FilledInput
            id="email"
            name="id"
            value={user.id}
            onChange={handleChange}
            aria-label="email"
            required
          />
        </FormControl>

        <FormControl fullWidth variant="filled" margin="normal">
          <InputLabel htmlFor="password">Password</InputLabel>
          <FilledInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={handleChange}
            aria-label="password"
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

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
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Don't have an account?{" "}
          <span
            style={{ color: "#914D7E", cursor: "pointer" }}
            onClick={() => setActiveTab(1)}
          >
            Register
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
