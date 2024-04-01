import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { NavLink } from "react-router-dom";
import { Modal } from "react-bootstrap";
import UserPage from "./UserLogin";
import { useState } from "react";
import { useAuth } from "../store/Auth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Navbar() {
  const { isLoggedIn, logoutUser, isAdmin, accountType, name } = useAuth();

  const handleLogoutUser = () => {
    logoutUser();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
              {isAdmin && (
                <li className="nav-item">
                  <NavLink
                    to="/admin"
                    className="nav-link "
                    aria-current="page"
                  >
                    Admin
                  </NavLink>
                </li>
              )}
              {accountType === "student" && (
                <li className="nav-item">
                  <NavLink to="/dashboard" className="nav-link">
                    DashBoard
                  </NavLink>
                </li>
              )}
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
              {isAdmin && (
                <li className="nav-item">
                  <NavLink to="/question-bank" className="nav-link">
                    Question Bank
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink to="/exams" className="nav-link">
                  Exams
                </NavLink>
              </li>
            </ul>

            <div className="ms-auto m-2">
              {isLoggedIn ? (
                <div>
                  <Button
                    id="demo-positioned-button"
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    Welcome, {name}
                  </Button>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleLogoutUser}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <NavLink className="nav-link" onClick={handleshowUserPage}>
                  <Button variant="contained" color="success">
                    Login or Signup
                  </Button>
                </NavLink>
              )}
            </div>
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
          <UserPage handleshowUserPage={handleshowUserPage} />
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
