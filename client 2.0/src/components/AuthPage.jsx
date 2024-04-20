import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./Auth";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function AuthPage({ handleshowUserPage }) {
  const [showRegisterPage, setShowRegisterPage] = useState(false);

  const handleTogglePage = () => {
    setShowRegisterPage(!showRegisterPage);
  };

  return (
    <>
      {showRegisterPage ? (
        <RegisterPage
          handleTogglePage={handleTogglePage}
          handleshowUserPage={handleshowUserPage}
        />
      ) : (
        <LoginPage
          handleTogglePage={handleTogglePage}
          handleshowUserPage={handleshowUserPage}
        />
      )}
    </>
  );
}

function RegisterPage({ handleTogglePage, handleshowUserPage }) {
  const { storeTokenInLS } = useAuth();
  const [academic, setAcademic] = useState({});
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    currentClass: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    currentClass: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setErrors({ ...errors, name: value ? "" : "Name is required" });
        break;
      case "email":
        setErrors({ ...errors, email: value ? "" : "Email is required" });
        break;
      case "mobile":
        setErrors({ ...errors, mobile: value ? "" : "Mobile is required" });
        break;
      case "password":
        setErrors({ ...errors, password: value ? "" : "Password is required" });
        break;
      case "currentClass":
        setErrors({
          ...errors,
          currentClass: value ? "" : "Class is required",
        });
        break;
      default:
        break;
    }

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          storeTokenInLS(data.token);
          handleshowUserPage();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("Form submission failed. Please check all fields.");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    for (const key in user) {
      if (!user[key]) {
        isValid = false;
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      } else {
        newErrors[key] = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={user.name}
              fullWidth
              id="name"
              name="name"
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              style={{ marginBottom: "20px" }}
            />
            <TextField
              label="Email"
              value={user.email}
              fullWidth
              id="email"
              name="email"
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              style={{ marginBottom: "20px" }}
            />
            <TextField
              label="Mobile"
              type="text"
              value={user.mobile}
              fullWidth
              id="mobile"
              name="mobile"
              onChange={handleChange}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              inputProps={{ maxLength: 10 }}
              style={{ marginBottom: "20px" }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={user.password}
              id="password"
              name="password"
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              style={{ marginBottom: "20px" }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="currentClass"
                name="currentClass"
                label="Class"
                value={user.currentClass}
                onChange={handleChange}
                error={Boolean(errors.currentClass)}
                helperText={errors.currentClass}
              >
                {academic &&
                  academic.classes &&
                  academic.classes.map((classes, index) => (
                    <MenuItem key={index} value={classes}>
                      {classes}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleTogglePage}>
                  {"Already have a account ? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

function LoginPage({ handleTogglePage, handleshowUserPage }) {
  const { storeTokenInLS } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    switch (name) {
      case "email":
        newErrors.email = value ? "" : "Email is required";
        break;
      case "password":
        newErrors.password = value ? "" : "Password is required";
        break;
      default:
        break;
    }

    setUser({ ...user, [name]: value });
    setErrors(newErrors);
    setLoginError("");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    for (const key in user) {
      if (!user[key]) {
        isValid = false;
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      } else {
        newErrors[key] = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="www.dakshana.org">
          Dakshana Foundation
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    );
  }

  const defaultTheme = createTheme();

  const handleSubmitUserLogin = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          const data = await response.json();
          storeTokenInLS(data.token);
          setUser({
            email: "",
            password: "",
          });
          handleshowUserPage();
        } else {
          // Handle other response codes (e.g., 4xx, 5xx)
          const errorMessage = await response.text();
          setLoginError(errorMessage);
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error:", error);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmitUserLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                value={user.email}
                onChange={handleInput}
                id="email"
                name="email"
                label="Email Address"
                error={Boolean(errors.email)}
                helperText={errors.email}
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={user.password}
                onChange={handleInput}
                error={Boolean(errors.password)}
                helperText={errors.password}
                id="password"
                name="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              {Boolean(loginError) && (
                <Typography color="error" component="h2">
                  {loginError}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleTogglePage}>
                    {" "}
                    {/* Changed href to "#" */}
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  );
}
