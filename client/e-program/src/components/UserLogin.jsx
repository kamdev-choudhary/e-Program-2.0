import { useState } from "react";
import { NavLink } from "react-router-dom";
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
      <div className="login">
        <div className="row border p-2  rounded">
          <div className="col-12 text-center">
            <img src="/brand-logo.jpg" alt="" height="100px" />
          </div>
          <hr className="mt-2" />

          <div className="col-12 ">
            <form onSubmit={handleOnSubmit}>
              <div className="form-row">
                <div class="form-group p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Email
                    </span>
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
                </div>

                <div class="form-group  p-2">
                  <div className="input-group flex-nowrap rounded border border-success">
                    <span
                      className="input-group-text bg-success text-light"
                      id="addon-wrapping"
                    >
                      Password
                    </span>
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
              </div>
              <div className="form-group mt-3 text-center">
                <button type="submit" className="btn btn-success">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
