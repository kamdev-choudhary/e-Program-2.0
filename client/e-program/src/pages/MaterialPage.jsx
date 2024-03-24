import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AddBooks from "../components/AddBooks";
import { Modal, Button } from "react-bootstrap";

const API_URL = "http://127.0.0.1:5000/api";

export default function MaterialPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    bookID: "",
    subject: "",
    category: "",
    author: "",
    PublishingYear: "",
  });
  const [showAddBook, setShowAddBook] = useState(false);

  const handleAddNewBook = () => {
    setShowAddBook(!showAddBook);
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(newBook);
    setNewBook({
      title: "",
      bookID: "",
      subject: "",
      category: "",
      author: "",
      PublishingYear: "",
    });
  };

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
            <button className="btn btn-success" onClick={handleAddNewBook}>
              Add New Books
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={showAddBook}
        onHide={handleAddNewBook}
        dialogClassName="modal-xl"
      >
        <Modal.Header>
          <Modal.Title>Add New Books</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleOnSubmit}>
            <div className="input-group mb-2">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Book ID
              </span>
              <input
                type="text"
                name="bookID"
                value={newBook.bookID}
                onChange={handleNewBookChange}
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="Book ID"
              />
            </div>
            <div className="input-group mb-2">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Book Title
              </span>
              <input
                type="text"
                className="form-control"
                name="title"
                value={newBook.title}
                onChange={handleNewBookChange}
                id="inlineFormInputGroup"
                placeholder="Book TItle"
              />
            </div>
            <div className="input-group mb-2">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Author
              </span>
              <input
                name="author"
                value={newBook.author}
                onChange={handleNewBookChange}
                type="text"
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="Author"
              />
            </div>
            <div className="input-group mb-2">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Subject
              </span>
              <input
                type="text"
                className="form-control"
                name="subject"
                value={newBook.subject}
                onChange={handleNewBookChange}
                id="inlineFormInputGroup"
                placeholder="Subject"
              />
            </div>
            <div className="input-group mb-2">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Category
              </span>
              <input
                type="text"
                className="form-control"
                name="category"
                value={newBook.category}
                onChange={handleNewBookChange}
                id="inlineFormInputGroup"
                placeholder="Category"
              />
            </div>
            <div className="input-group mb-2">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Publishing Year
              </span>
              <input
                type="text"
                className="form-control"
                name="PublishingYear"
                value={newBook.PublishingYear}
                onChange={handleNewBookChange}
                id="inlineFormInputGroup"
                placeholder="Publishing Year"
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="file"
                className="form-control"
                id="inlineFormInputGroup"
              />
            </div>
            <div className="row ms-auto">
              <div className="div col-12 text-center">
                <button className="form-control btn btn-success ">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleAddNewBook}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
