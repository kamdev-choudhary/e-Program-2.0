import { useState, useEffect } from "react";
import Users from "../components/Users";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const API_URL = "http://127.0.0.1:5000/api";

export default function AdminPage() {
  const [showAddExamTemplate, setShowAddExamTemplate] = useState(false);
  const [ShowAdminContent, setShowAdminContent] = useState("dashboard");
  const [examTemplates, setExamTemplates] = useState([]);
  const [error, setError] = useState("");

  const handleAdminContent = (view) => {
    setShowAdminContent(view);
  };

  const handleShowAddTemplate = () => {
    setShowAddExamTemplate(!showAddExamTemplate);
  };

  useEffect(() => {
    fetch(`${API_URL}/exams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setExamTemplates(data.examTemplates))
      .catch((error) => setError(error.message));
  }, []);

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
          {ShowAdminContent === "exam" && (
            <>
              <div>
                <p className="text-center mt-2 h4 border p-2 bg-secondary text-white">
                  Exam Master (Test Templates)
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-10">
                    <div className="input-group flex-nowrap rounded border border-secondary-emphasis">
                      <span
                        className="input-group-text bg-success text-light"
                        id="addon-wrapping"
                      >
                        <b>Search</b> &nbsp; &nbsp;&nbsp;
                        <i className="fa fa-search"></i>
                      </span>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-success"
                      onClick={handleShowAddTemplate}
                    >
                      Add Template
                    </button>
                  </div>
                </div>
                <div className="content"></div>
              </div>
              <Modal show={showAddExamTemplate} onHide={handleShowAddTemplate}>
                <Modal.Header>Create Exam Template</Modal.Header>
                <Modal.Body>
                  <form>
                    <div class="form-group col-md-12 p-2">
                      <div className="input-group flex-nowrap rounded border border-success">
                        <span
                          className="input-group-text bg-success text-light"
                          id="addon-wrapping"
                        >
                          Exam Name
                        </span>
                        <input className="form-control" type="text" name="" />
                      </div>
                    </div>
                    <div class="form-group col-md-12 p-2">
                      <div className="input-group flex-nowrap rounded border border-success">
                        <span
                          className="input-group-text bg-success text-light"
                          id="addon-wrapping"
                        >
                          Pattern
                        </span>
                        <input className="form-control" type="text" name="" />
                      </div>
                    </div>
                    <div className="submit-button text-center">
                      <button className="btn btn-success">Save</button>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleShowAddTemplate}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <hr />
              <table className="table mt-2 border table-hover">
                <thead className="bg-success">
                  <tr>
                    <th scope="col" className="bg-success text-white ">
                      SN
                    </th>
                    <th scope="col" className="bg-success text-white">
                      Exam ID
                    </th>
                    <th scope="col" className="col bg-success text-white">
                      Template Name
                    </th>
                    <th scope="col" className="col bg-success text-white">
                      Created At
                    </th>
                    <th scope="col" className="bg-success text-white">
                      Pattern
                    </th>
                    <th scope="col" className="bg-success text-white">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examTemplates.map((examtemplate, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{examtemplate.examId}</td>
                        <td>{examtemplate.examName}</td>
                        <td>{examtemplate.createdAt}</td>
                        <td>{examtemplate.examPattern}</td>
                        <td>
                          <button className="btn btn-sm btn-success">
                            View
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}
