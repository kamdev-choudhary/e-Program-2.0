import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function RegisterPage() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
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
      fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
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
      <Paper sx={{ padding: 4 }} style={{ height: 650 }} elevation={4}>
        <img
          src="./brand-logo.jpg"
          alt="Brand-logo"
          style={{ height: "100px", marginLeft: "45%" }}
        />
        <Typography variant="h4">Registration Form</Typography>
        <hr />
        <Grid container spacing={2} padding={2}>
          <Grid item md={6} sm={12} padding={1}>
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
          </Grid>
          <Grid item md={6} sm={12} padding={1}>
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
          </Grid>
          <Grid item md={6} sm={12} padding={1}>
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
          </Grid>
          <Grid item md={6} sm={12} padding={1}>
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
          </Grid>
          <Grid item md={6} sm={12} padding={1}>
            <TextField
              label="Current Class"
              type="text"
              fullWidth
              value={user.currentClass}
              id="currentClass"
              name="currentClass"
              onChange={handleChange}
              error={Boolean(errors.currentClass)}
              helperText={errors.currentClass}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item md={12} sm={12} style={{ textAlign: "center" }}>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
