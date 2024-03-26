import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import UserPage from "./UserLogin";
import { useState } from "react";

function Navbar() {
  const [showUserPage, setShowUserPage] = useState(false);
  function handleshowUserPage() {
    setShowUserPage(!showUserPage);
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src="/brand-logo.jpg" alt="" />
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
                <NavLink className="nav-link " onClick={handleshowUserPage}>
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal
        show={showUserPage}
        onHide={handleshowUserPage}
        dialogClassName="modal-md"
      >
        <Modal.Header>
          <Modal.Title>Login to Website</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserPage />
          <div className="m-1 mt-2 text-center">
            New to Dakshana
            <NavLink
              to="/register"
              className="text-decoration-none ms-2 p-1"
              onClick={handleshowUserPage}
            >
              Register
            </NavLink>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleshowUserPage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Navbar;
