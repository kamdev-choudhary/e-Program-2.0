import React, { useState, useMemo, useEffect } from "react";
import { CustomModal } from "../../components/CustomModal";
import {
  Box,
  Button,
  OutlinedInput,
  Typography,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { API_URL } from "../../constants/helper";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { useGlobalProvider } from "../../GlobalProvider";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CustomDropDown from "../../components/CustomDropDown";

function Library() {
  const { isValidResponse, user } = useGlobalProvider();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState([]);

  const getAllBooks = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${API_URL}/materials`);
      if (isValidResponse(response)) {
        setBooks(response?.data?.books);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  // Book information fields
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    subject: "",
    classLevel: "",
    category: "",
    publishingYear: "",
  });

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle input changes for book fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("subject", bookData.subject);
    formData.append("classLevel", bookData.classLevel);
    formData.append("category", bookData.category);
    formData.append("publishingYear", bookData.publishingYear);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        `${API_URL}/materials/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (isValidResponse(response)) {
        setBooks(response?.data?.books);
        setUploadStatus(response.data.message || "Upload successful!");
        setSelectedFile(null);
        setShowUploadModal(false);
      }
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
      console.error("Upload error:", error.response?.data || error.message);
    }
  };

  const handleDeleteBook = async (id) => {
    Swal.fire({
      title: "Area You sure,",
      text: "You waint be able to rever this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it.",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(`${API_URL}/materials/${id}`);
        if (isValidResponse(response)) {
          setBooks(response?.data?.books);
          Swal.fire({
            title: response.data.message,
            icon: "success",
          });
        }
      }
    });
  };

  const handleOpenBook = (book) => {
    // window.open(book.fileLink);
    navigate(`/library/book/${book?._id}`, {
      state: { fileLink: book?.fileLink },
    });
  };

  const columns = [
    {
      field: "id",
      headerName: "SN",
    },
    {
      field: "title",
      headerName: "Name",
      width: 150,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
      flex: 1,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "subject",
      headerName: "Subject",
      width: 150,
      flex: 1,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "publishingYear",
      headerName: "Publishing Year",
      width: 150,
      flex: 1,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      flex: 1,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
    },
    {
      field: "view",
      headerName: "View",
      width: 150,
      flex: 1,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleOpenBook(params.row)}
            variant="contained"
          >
            View
          </Button>
        </>
      ),
    },
    {
      field: "fileLink",
      headerName: "Action",
      width: 150,
      flex: 1,
      align: "center",
      minWidth: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setSelectedBook(params.row);
              setShowEditModal(true);
            }}
          >
            <EditRounded />
          </IconButton>
          <IconButton onClick={() => handleDeleteBook(params.row._id)}>
            <DeleteRounded />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = useMemo(() => {
    return books?.map((b, index) => ({
      id: index + 1,
      ...b,
    }));
  }, [books]);

  return (
    <>
      <Box sx={{ mt: 1 }} component={Paper}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 6, lg: 4 }}>
              <CustomDropDown label="Category" />
            </Grid>
          </Grid>
        </Box>
        <DataGrid
          columns={columns}
          rows={rows}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onAddButtonClick={() => setShowUploadModal(true)}
              />
            ),
          }}
        />
      </Box>

      <CustomModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        header="Upload Files"
        width="auto"
        height="auto"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          p={2}
          sx={{ maxWidth: 600 }}
        >
          <TextField
            size="small"
            label="Title"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label="Author"
            name="author"
            value={bookData.author}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label="Subject"
            name="subject"
            value={bookData.subject}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label="Class Level"
            name="classLevel"
            value={bookData.classLevel}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label="Category"
            name="category"
            value={bookData.category}
            onChange={handleInputChange}
          />
          <TextField
            size="small"
            label="Publishing Year"
            name="publishingYear"
            value={bookData.publishingYear}
            onChange={handleInputChange}
          />
          <OutlinedInput
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: [".pdf", ".jpg", ".jpeg", ".png"] }}
          />
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload PDF
          </Button>
          {uploadStatus && <Typography>{uploadStatus}</Typography>}
        </Box>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        header="Edit Book"
        height="auto"
        width="auto"
      ></CustomModal>
    </>
  );
}

export default Library;
