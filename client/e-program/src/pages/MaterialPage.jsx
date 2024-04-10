import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import Input from "@mui/material/Input";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useAuth } from "../components/Auth";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function MaterialPage() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [currBook, setCurrBook] = useState([]);
  const [base64String, setBase64String] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    bookId: "",
    subject: "",
    category: "",
    author: "",
    publishingYear: "",
  });
  const [showAddBook, setShowAddBook] = useState(false);
  const [pdfViewer, setPdfViwer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [academic, setAcademic] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => setAcademic(data.academic[0]))
      .then((error) => console.log("Error", error));
  }, []);

  const handleAddNewBook = () => {
    setShowAddBook(!showAddBook);
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;

    if (e.target.name !== "file") {
      setNewBook({ ...newBook, [name]: value });
    } else {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Result = reader.result;
          setNewBook({ ...newBook, [name]: base64Result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  console.log(academic);

  const handleOnSubmit = async (e) => {
    fetch(`${API_URL}/materials/savenewbook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => {
        response.json();
        if (response.ok) {
          handleAddNewBook();
          setShowAddBook(!showAddBook);
          setRefresh(!refresh);
        }
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleViewBook = (book) => {
    setCurrBook({ ...book });
    setBase64String(book.file);
    setPdfViwer(!pdfViewer);
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
  }, [refresh]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredBooks = books.filter((book) =>
    Object.values(book).some(
      (field) =>
        (typeof field === "string" || typeof field === "number") &&
        field.toString().toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  const handleDeleteBook = (id) => {
    console.log(id);
    fetch(`${API_URL}/materials/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log("Success", data))
      .catch((error) => console.log("Error", error));
    setRefresh(!refresh);
  };

  return (
    <>
      {error && <div>Error: {error}</div>}
      <div className="row">
        <div className="col-md-8 ">
          <FormControl fullWidth sx={{ m: 1 }} size="small">
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">
                  Search <SearchIcon />
                </InputAdornment>
              }
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </FormControl>
        </div>
        {isAdmin && (
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <Fab
              color="primary"
              aria-label="add"
              onClick={handleAddNewBook}
              size="small"
            >
              <AddIcon />
            </Fab>
          </div>
        )}
      </div>

      <Modal
        show={showAddBook}
        onHide={handleAddNewBook}
        dialogClassName="modal-md"
      >
        <Modal.Header>
          <Modal.Title>Add New Books</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <TextField
                fullWidth
                label="Book ID"
                id="bookId"
                name="bookId"
                value={newBook.bookId}
                onChange={handleNewBookChange}
                style={{ marginBottom: "20px" }}
              />
            </div>
            <div className="col-md-12">
              <TextField
                fullWidth
                label="Book Title"
                id="bookId"
                name="title"
                value={newBook.title}
                onChange={handleNewBookChange}
                style={{ marginBottom: "20px" }}
              />
            </div>
            <div className="col-md-12">
              <TextField
                fullWidth
                label="Author"
                id="bookId"
                name="author"
                value={newBook.author}
                onChange={handleNewBookChange}
                style={{ marginBottom: "20px" }}
              />
            </div>
            <div className="col-md-12">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                <Select
                  labelId="Subject-label"
                  id="subject"
                  name="subject"
                  label="Subject"
                  value={newBook.subject}
                  onChange={handleNewBookChange}
                  style={{ marginBottom: "20px" }}
                >
                  {academic &&
                    academic.subjects &&
                    academic.subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.name}>
                        {subject.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-12">
              <TextField
                fullWidth
                label="Category"
                id="bookId"
                name="category"
                value={newBook.category}
                onChange={handleNewBookChange}
                style={{ marginBottom: "20px" }}
              />
            </div>
            <div className="col-md-12">
              <TextField
                fullWidth
                type="number"
                label="Publishing Year"
                id="bookId"
                name="publishingYear"
                value={newBook.publishingYear}
                onChange={handleNewBookChange}
                style={{ marginBottom: "20px" }}
              />
            </div>
            <div className="col-md-12">
              <Input
                type="file"
                name="file"
                onChange={handleNewBookChange}
                inputProps={{
                  accept: "application/pdf",
                }}
                id="file-input"
              />
            </div>
            <div className="col-md-12 text-center mt-3">
              <Button
                variant="contained"
                color="success"
                onClick={handleOnSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="error" onClick={handleAddNewBook}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-success ">
            <TableRow>
              <TableCell align="center" className="text-white">
                Book ID
              </TableCell>
              <TableCell align="center" className="text-white">
                Title
              </TableCell>
              <TableCell align="center" className="text-white">
                Author
              </TableCell>
              <TableCell align="center" className="text-white">
                Subject
              </TableCell>
              <TableCell align="center" className="text-white">
                Category
              </TableCell>
              <TableCell align="center" className="text-white">
                Publishing Year
              </TableCell>
              <TableCell align="center" className="text-white">
                View Book
              </TableCell>
              {isAdmin && (
                <TableCell align="center" className="text-white">
                  Delete Boook
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book, index) => (
              <TableRow
                key={book._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell className="text-center">{book.bookId}</TableCell>
                <TableCell className="text-center">{book.title}</TableCell>
                <TableCell className="text-center">{book.author}</TableCell>
                <TableCell className="text-center">{book.subject}</TableCell>
                <TableCell className="text-center">{book.category}</TableCell>
                <TableCell className="text-center">
                  {book.publishingYear}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => handleViewBook(book)}
                  >
                    view
                  </Button>
                </TableCell>
                {isAdmin && (
                  <TableCell align="center" className="text-white">
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteBook(book._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal show={pdfViewer} onHide={() => setPdfViwer(false)}>
        <Modal.Header>PDF Viewer</Modal.Header>
        <Modal.Body>
          <>View PDF</>
        </Modal.Body>
      </Modal>
    </>
  );
}
