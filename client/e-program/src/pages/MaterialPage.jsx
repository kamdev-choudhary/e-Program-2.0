import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/api";

export default function MaterialPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/materials`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setBooks(data.books))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <>
      {error && <div>Error: {error}</div>}
      <div className="row">
        <div className="row mb-2">
          <div className="col-md-6 ">
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
          <div className="col-md-6 text-center">
            <button className="btn btn-success">Add New Books</button>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <table className="table table-hover table-bordered border-secondary-emphasis rounded">
          <thead>
            <tr>
              <th scope="col" className="text-center">
                Book ID
              </th>
              <th scope="col" className="text-center">
                Title
              </th>
              <th scope="col" className="text-center">
                Author
              </th>
              <th scope="col" className="text-center">
                Subject
              </th>
              <th scope="col" className="text-center">
                Category
              </th>
              <th scope="col" className="text-center">
                Publishing Year
              </th>
              <th scope="col" className="text-center">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="text-center">{book.bookId}</td>
                  <td className="text-center">{book.title}</td>
                  <td className="text-center">{book.author}</td>
                  <td className="text-center">{book.subject}</td>
                  <td className="text-center">{book.category}</td>
                  <td className="text-center">{book.PublishingYear}</td>
                  <td className="text-center">
                    <NavLink to="/materials">
                      <button className="btn btn-sm btn-success">View</button>
                    </NavLink>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
