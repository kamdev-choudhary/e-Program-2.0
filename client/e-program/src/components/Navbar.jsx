import "./Navbar.css";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img
              src="https://www.dakshana.org/wp-content/uploads/2017/10/new-logo.png"
              alt=""
            />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link " aria-current="page">
                  Admin
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/lectures" className="nav-link">
                  Lectures
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/materials" className="nav-link">
                  Materials
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/question bank" className="nav-link">
                  Question Bank
                </NavLink>
              </li>
              <li className="nav-item dropdown ml-5">
                <NavLink
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Exam
                </NavLink>
                <ul className="dropdown-menu bg-light">
                  <li>
                    <NavLink
                      to="/offlineexams"
                      className="dropdown-item bg-light text-dark"
                    >
                      Offline
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/onlineexams"
                      className="dropdown-item bg-light text-dark"
                    >
                      Online
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item ">
                <NavLink className="nav-link " to="/login">
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;