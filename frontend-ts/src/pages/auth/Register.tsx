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
  password: string;
  mobile: string;
  email: string;
  name: string;
}

interface UserError {
  password: boolean;
  mobile: boolean;
  email: boolean;
  name: boolean;
}

interface RegisterProps {
  setActiveTab: (value: number) => void;
}

const Register: React.FC<RegisterProps> = ({ setActiveTab }) => {
  const { handleUserLogin } = useGlobalContext();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // More informative error state
  const [formError, setFormError] = useState<UserError>({
    name: false,
    mobile: false,
    email: false,
    password: false,
  });

  // Validate user input fields
  const validateUser = (): boolean => {
    const isValidName = user.name.trim() !== "";
    const isValidEmail = user.email.trim() !== "";
    const isValidMobile = user.mobile.trim() !== "";
    const isValidPassword = user.password.trim() !== "";

    setFormError({
      name: !isValidName,
      email: !isValidEmail,
      mobile: !isValidMobile,
      password: !isValidPassword,
    });
    return isValidName && isValidEmail && isValidMobile && isValidPassword;
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUser()) return;

    setLoading(true); // Set loading state to true while making the API request

    try {
      const response = await axios.post("/auth/register", user);
      if (response.status === 200) {
        handleUserLogin(response.data);
        dispatch({ type: "SET_AUTHPAGE", payload: false });
      }
    } catch (error: any) {
      console.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false); // Reset loading state after the request is complete
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
          Register
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Name"
            value={user.name}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
            error={formError.name}
            helperText={formError.name && "Name is Required"}
          />
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            error={formError.email}
            helperText={formError.email && "Email is Required"}
          />
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Mobile"
            variant="outlined"
            value={user.mobile}
            onChange={(e) => {
              setUser((prev) => ({ ...prev, mobile: e.target.value }));
              if (formError.mobile)
                setFormError((prev) => ({ ...prev, mobile: false }));
            }}
            error={formError.mobile}
            helperText={formError.mobile && "Mobile is Required"}
            type="tel" // More appropriate input type for phone numbers
          />
          <TextField
            size="small"
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={user.password}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            autoComplete="new-password"
            error={formError.password}
            helperText={formError.password && "Password is Required"}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography sx={{ mr: 1 }}>Already have an account? </Typography>
          <Button size="small" onClick={() => setActiveTab(0)}>
            Log in
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
