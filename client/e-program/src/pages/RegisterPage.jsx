import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RegisterPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

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
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation
    const isValid = validateForm();

    // If form is valid, submit
    if (isValid) {
      console.log("Form submitted successfully!");
    } else {
      console.log("Form submission failed. Please check all fields.");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field
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
      <div className="text-center">
        <img
          src="./brand-logo.jpg"
          alt="Brand-logo"
          style={{ height: "100px" }}
        />
        <hr />
        <div className="row border p-3">
          <div className="col-md-12">
            <FormControl fullWidth>
              <FormLabel>Registration Form</FormLabel>
              <TextField
                label="Full Name"
                value={user.name}
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
                id="email"
                name="email"
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                style={{ marginBottom: "20px" }}
              />
              <TextField
                label="Mobile"
                type="number"
                value={user.mobile}
                id="mobile"
                name="mobile"
                onChange={handleChange}
                error={Boolean(errors.mobile)}
                helperText={errors.mobile}
                style={{ marginBottom: "20px" }}
              />
              <TextField
                label="Password"
                type="password"
                value={user.password}
                id="password"
                name="password"
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                style={{ marginBottom: "20px" }}
              />
            </FormControl>
          </div>
          <div className="col-md-12 text-center">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
