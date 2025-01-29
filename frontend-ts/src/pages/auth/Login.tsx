import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { useDispatch } from "react-redux";
import useSessionDetails from "../../utils/useSessionDetails";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "../../hooks/AxiosInterceptor";

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
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const sessionDetails = useSessionDetails();

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
        padding: 1,
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
        <TextField
          size="small"
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={user.id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser((prev) => ({ ...prev, id: e.target.value }))
          }
          aria-label="email"
          required
        />
        <TextField
          size="small"
          fullWidth
          margin="normal"
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={user.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser((prev) => ({ ...prev, password: e.target.value }))
          }
          aria-label="password"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
