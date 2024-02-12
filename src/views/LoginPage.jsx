import React, { useState } from "react";
const API_URL = "http://127.0.0.1:5000/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
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

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="row mt-3">
      <div className="col-6 offset-3">
        <h3>Login to Dakshana E-program</h3>
        <form onSubmit={handleOnSubmit}>
          <div className="form-row">
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
