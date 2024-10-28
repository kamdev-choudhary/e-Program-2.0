import React, { useState, useEffect } from "react";
import { AddRounded, Delete, Edit } from "@mui/icons-material";
import {
  Divider,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { API_URL } from "../../../constants/helper";
import axios from "axios";
import { useGlobalProvider } from "../../../GlobalProvider";
import { CustomModal } from "../../../components/CustomModal";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

function AcademicInfo() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [classes, setClasses] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showEditClass, setShowEditClass] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", value: "" });
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState([]);

  const getClasses = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get(`${API_URL}/academic/class`);
      if (isValidResponse(response)) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  const handleSaveClass = async () => {
    if (!newClass.name || !newClass.value) {
      Swal.fire({ title: "Both Class Name and Value are required" });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/academic/class`, newClass);
      if (isValidResponse(response)) {
        setClasses(response.data.classes);
        setNewClass({ name: "", value: "" }); // Reset form
        setShowAddClass(false); // Close modal after saving
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setShowEditClass(true);
  };

  const handleDeleteClass = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${API_URL}/academic/class/${id}`
          );
          if (response?.data?.status_code === 1) {
            setClasses(response.data.classes);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveClassEdit = async () => {
    try {
      if (!selectedClass.name || !selectedClass.value) {
        Swal.fire({ title: "Both Class Name and Value are required" });
        return;
      }
      const response = await axios.patch(
        `${API_URL}/academic/class/${selectedClass?._id}`,
        {
          ...selectedClass,
        }
      );
      setClasses(response?.data?.classes);
      setShowEditClass(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {" "}
          <Box component={Paper}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: "#28844f",
              }}
            >
              <Typography sx={{ ml: 1, color: "#fff" }} variant="h6">
                Classes
              </Typography>
              <IconButton
                variant="contained"
                onClick={() => setShowAddClass(true)}
              >
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            <Divider />
            <List sx={{ height: 350, overflow: "auto" }}>
              {classes.map((classItem, index) => (
                <ListItem key={index} sx={{ justifyContent: "space-between" }}>
                  <Typography>{classItem.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleEditClass(classItem)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClass(classItem?._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      {/* Add Class Modal */}
      <CustomModal
        open={showAddClass}
        height="auto"
        width="auto"
        onClose={() => setShowAddClass(false)}
      >
        <Box sx={{ display: "grid", rowGap: 2, minWidth: 450 }}>
          <TextField
            size="small"
            fullWidth
            label="Class Name"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
            error={!newClass.name && error}
            helperText={
              !newClass.name && error ? "Class Name is required." : ""
            }
          />
          <TextField
            size="small"
            fullWidth
            label="Value"
            value={newClass.value}
            onChange={(e) =>
              setNewClass({ ...newClass, value: e.target.value })
            }
            error={!newClass.value && error}
            helperText={!newClass.value && error ? "Value is required." : ""}
          />
          <Button variant="contained" onClick={handleSaveClass}>
            Save
          </Button>
        </Box>
      </CustomModal>

      {/* Edit Class Modal */}
      <CustomModal
        open={showEditClass}
        height="auto"
        width="auto"
        onClose={() => setShowEditClass(false)}
      >
        <Box sx={{ display: "grid", rowGap: 2, minWidth: 450 }}>
          <TextField
            size="small"
            fullWidth
            label="Class Name"
            value={selectedClass.name}
            onChange={(e) =>
              setSelectedClass({ ...selectedClass, name: e.target.value })
            }
            error={!selectedClass.name && error}
            helperText={
              !selectedClass.name && error ? "Class Name is required." : ""
            }
          />
          <TextField
            size="small"
            fullWidth
            label="Value"
            value={selectedClass.value}
            onChange={(e) =>
              setSelectedClass({ ...selectedClass, value: e.target.value })
            }
            error={!selectedClass.value && error}
            helperText={
              !selectedClass.value && error ? "Value is required." : ""
            }
          />
          <Button variant="contained" onClick={handleSaveClassEdit}>
            Save
          </Button>
        </Box>
      </CustomModal>
    </>
  );
}

export default AcademicInfo;
