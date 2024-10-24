import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../../constants/helper";

function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    mobile: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    name: "",
    password: "",
  });

  const validateFields = () => {
    const newErrors = {
      email: "",
      mobile: "",
      name: "",
      password: "",
    };
    let isValid = true;

    if (!user.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!user.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email is invalid.";
      isValid = false;
    }
    if (!user.mobile) {
      newErrors.mobile = "Mobile number is required.";
      isValid = false;
    }
    if (!user.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegisterNewUser = async () => {
    if (validateFields()) {
      const response = await axios.post(`${API_URL}/register`, { ...user });
      // Registration logic here
    }
  };

  const handleInputChanges = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.email || errors.name || errors.mobile || errors.password) {
      setErrors({
        email: "",
        mobile: "",
        name: "",
        password: "",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          <Typography variant="h6">Register</Typography>
        </Box>
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={(e) => handleInputChanges(e)}
          sx={{ minWidth: 350 }}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          value={user.email}
          name="email"
          onChange={(e) => handleInputChanges(e)}
          type="email"
          sx={{ minWidth: 350 }}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Mobile"
          value={user.mobile}
          name="mobile"
          onChange={(e) => handleInputChanges(e)}
          type="tel"
          sx={{ minWidth: 350 }}
          error={!!errors.mobile}
          helperText={errors.mobile}
        />
        <TextField
          label="Password"
          value={user.password}
          onChange={(e) => handleInputChanges(e)}
          name="password"
          type="password"
          sx={{ minWidth: 350 }}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button onClick={handleRegisterNewUser} variant="contained">
          Register
        </Button>
        <Typography
          component="a"
          href="/login"
          variant="body1"
          color="primary"
          style={{ textDecoration: "none" }}
        >
          Already have an Account? Login.
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
