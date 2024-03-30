import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
const API_URL = "http://127.0.0.1:5000/api";

export default function UserPage() {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
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
        username: "",
        password: "",
      });
      navigate("/");
    }
  };
  return (
    <>
      <div className="mb-2">
        <TextField
          fullWidth
          label="Email"
          value={user.email}
          onChange={handleInput}
          id="email"
          name="email"
          style={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={user.password}
          onChange={handleInput}
          id="password"
          name="password"
        />
      </div>
      <div className="text-center">
        <Button variant="contained" color="primary">
          Login
        </Button>
      </div>
      <hr />
    </>
  );
}
