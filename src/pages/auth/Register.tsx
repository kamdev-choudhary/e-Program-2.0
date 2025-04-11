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

type User = {
  name: string;
  mobile: string;
  email: string;
  password: string;
};

type FieldKeys = keyof User;

const Register: React.FC<{ setActiveTab: (value: number) => void }> = ({
  setActiveTab,
}) => {
  const { handleUserLogin } = useGlobalContext();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<Record<FieldKeys, boolean>>({
    name: false,
    mobile: false,
    email: false,
    password: false,
  });

  const fields: FieldKeys[] = ["name", "mobile", "email", "password"];

  const validateForm = () => {
    const errors = {} as Record<FieldKeys, boolean>;
    let isValid = true;

    fields.forEach((key) => {
      const isEmpty = !user[key].trim();
      errors[key] = isEmpty;
      if (isEmpty) isValid = false;
    });

    setFormError(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", user);
      handleUserLogin(data);
      dispatch({ type: "SET_AUTHPAGE", payload: false });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, p: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {fields.map((key) => (
          <FormControl
            key={key}
            fullWidth
            margin="normal"
            error={formError[key]}
            variant="filled"
          >
            <InputLabel>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </InputLabel>
            <FilledInput
              id={key}
              value={user[key]}
              onChange={(e) => setUser({ ...user, [key]: e.target.value })}
              type={key === "password" ? "password" : "text"}
              autoComplete={key === "password" ? "new-password" : "off"}
            />
          </FormControl>
        ))}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button
            onClick={() => setActiveTab(0)}
            sx={{ color: "#914D7E", textTransform: "none" }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
