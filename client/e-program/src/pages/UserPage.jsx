import { useState } from "react";
const API_URL = "http://127.0.0.1:5000/api";

export default function UserPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

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
  return (
    <div className="row">
      <div className="col-6 align-center">
        <img
          className=""
          src="https://www.dakshana.org/wp-content/uploads/2017/10/new-logo.png"
          alt=""
          height="300px"
        />
      </div>
      <div className="col-6 ">
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
}
