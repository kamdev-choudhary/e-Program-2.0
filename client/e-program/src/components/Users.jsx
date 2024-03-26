import { useEffect, useState } from "react";
import React from "react";

const API_URL = "http://127.0.0.1:5000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/admin/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUsers(data.users))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-6 text-center">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              <b>Search</b> &nbsp; &nbsp;&nbsp;
              <i className="fa fa-search"></i>
            </span>
            <input className="form-control" type="text" name="search" />
          </div>
        </div>
        <div className="col-md-6 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Account Type
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select Account Type --</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
      <hr />
      <table className="table mt-2 border table-hover">
        <thead className="bg-success">
          <tr>
            <th scope="col" className="bg-success text-white ">
              SN
            </th>
            <th scope="col" className="col-1 bg-success text-white">
              Name
            </th>
            <th scope="col" className="col-4 bg-success text-white">
              Email
            </th>
            <th scope="col" className="bg-success text-white">
              Mobile
            </th>
            <th scope="col" className="bg-success text-white">
              Account Type
            </th>
            <th scope="col" className="bg-success text-white">
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.accountType}</td>
                <td>
                  <button className="btn btn-sm btn-success">View</button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}
