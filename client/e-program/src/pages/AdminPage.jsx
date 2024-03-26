import { useState } from "react";
import { NavLink } from "react-router-dom";
import UserPage from "../components/UserLogin";
import Users from "../components/Users";

export default function AdminPage() {
  const [ShowAdminContent, setShowAdminContent] = useState("dashboard");
  const handleAdminContent = (view) => {
    setShowAdminContent(view);
  };
  return (
    <>
      <div className="row ">
        <div className="col-md-3 sidebar  list-group rounded">
          <table className="table table-hover ">
            <thead>
              <tr></tr>
            </thead>
            <tbody>
              <tr>
                <th
                  scope="row"
                  className="text-center"
                  onClick={() => handleAdminContent("dashboard")}
                >
                  Dashboard
                </th>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="text-center"
                  onClick={() => handleAdminContent("users")}
                >
                  User Master
                </th>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="text-center"
                  onClick={() => handleAdminContent("exam")}
                >
                  Exam Master
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-9 border rounded ">
          {ShowAdminContent === "dashboard" && (
            <div>
              <p className="text-center mt-2 h4 border p-2 bg-secondary text-white">
                Dashboard
              </p>
              <hr />
            </div>
          )}
          {ShowAdminContent === "users" && (
            <div>
              <p className="text-center mt-2 h4 border p-2 bg-secondary text-white">
                User Control
              </p>
              <hr />
              <div className="content">
                <Users />
              </div>
            </div>
          )}
          {ShowAdminContent === "exam" && <p>Exam Master</p>}
        </div>
      </div>
    </>
  );
}
