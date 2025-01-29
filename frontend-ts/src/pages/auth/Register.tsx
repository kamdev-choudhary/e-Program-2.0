import {
  Box,
  Typography,
  FilledInput,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { useDispatch } from "react-redux";
import axios from "../../hooks/AxiosInterceptor";

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
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<UserError>({
    name: false,
    mobile: false,
    email: false,
    password: false,
  });

  const validateUser = (): boolean => {
    const isValid = {
      name: user.name.trim() !== "",
      email: user.email.trim() !== "",
      mobile: user.mobile.trim() !== "",
      password: user.password.trim() !== "",
    };
    setFormError({
      name: !isValid.name,
      email: !isValid.email,
      mobile: !isValid.mobile,
      password: !isValid.password,
    });
    return Object.values(isValid).every(Boolean);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUser()) return;

    setLoading(true);

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
        p: 1,
        maxWidth: 350,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
        {Object.entries(user).map(([key, value]) => (
          <FormControl
            key={key}
            fullWidth
            margin="normal"
            error={formError[key as keyof UserError]}
          >
            <InputLabel>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </InputLabel>
            <FilledInput
              type={key === "password" ? "password" : "text"}
              value={value}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, [key]: e.target.value }))
              }
              autoComplete={key === "password" ? "new-password" : "off"}
            />
          </FormControl>
        ))}
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
        <Typography sx={{ mr: 1 }}>
          Already have an account?{" "}
          <span
            style={{ color: "#914D7E", cursor: "pointer" }}
            onClick={() => setActiveTab(0)}
          >
            Login
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
