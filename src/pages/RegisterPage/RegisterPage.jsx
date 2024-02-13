import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = "http://127.0.0.1:5000/api";

const RegisterPage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      setUser({
        username: "",
        email: "",
        password: "",
        phone: "",
      });
      navigate("/login");
    }
  };

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="row">
      <div className="col-6 offset-3">
        <h3>Register to Dakshana E-program</h3>
        <form
          noValidate="1"
          className="needs-vadiation"
          onSubmit={handleOnSubmit}
        >
          <div className="form-row">
            <div className="form-group mt-3">
              <label htmlFor="identifier">Username</label>
              <input
                onChange={handleInput}
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={user.username}
                placeholder="Username"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="identifier">Email</label>
              <input
                onChange={handleInput}
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.email}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="identifier">Phone</label>
              <input
                onChange={handleInput}
                type="phone"
                className="form-control"
                id="phone"
                name="phone"
                value={user.phone}
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="inputPassword">Password</label>
              <input
                onChange={handleInput}
                type="password"
                className="form-control"
                id="inputPassword"
                name="password"
                value={user.password}
                placeholder="Password"
                required
              />
            </div>
          </div>
          <div className="form-group mt-3 ms-auto"></div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
