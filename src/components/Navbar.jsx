import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";

export const Navbar = () => {
  const { isLoggedIn } = useAuth();
  return (
    <nav className="navbar navbar-expand-md sticky-top bg-light navbar-light mb-3">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          <img
            src="https://www.dakshana.org/wp-content/uploads/2017/10/new-logo.png"
            alt="MDB Logo"
            draggable="false"
            height="50"
          />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link mx-2">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/lectures" className="nav-link mx-2">
                Lectures
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/syllabus" className="nav-link mx-2">
                Syllabus
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/exams" className="nav-link mx-2">
                Exams
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/library" className="nav-link mx-2">
                Library
              </NavLink>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item ms-3">
                  <NavLink
                    to="/logout"
                    className="btn btn-outline-danger btn-rounded"
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-3">
                  <NavLink
                    to="/login"
                    className="btn btn-outline-success btn-rounded"
                  >
                    Sign in
                  </NavLink>
                </li>

                <li className="nav-item ms-3">
                  <NavLink
                    to="/register"
                    className="btn btn-outline-danger btn-rounded"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
