import React, { useState, useEffect } from "react";
import { AddRounded, Delete, Edit } from "@mui/icons-material";
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  TextField,
  IconButton,
  Paper,
  ListSubheader,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { CustomModal } from "../../../components/CustomModal";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  addNewClass,
  deleteClass,
  editClass,
  getClasses,
} from "../../../api/academic";
import { useGlobalContext } from "../../../contexts/GlobalProvider";

interface ClassItem {
  _id?: string;
  name: string;
  value: string;
}

const AcademicInfo: React.FC = () => {
  const { isValidResponse } = useGlobalContext();
  const dispatch = useDispatch();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [showAddClass, setShowAddClass] = useState<boolean>(false);
  const [showEditClass, setShowEditClass] = useState<boolean>(false);
  const [newClass, setNewClass] = useState<ClassItem>({ name: "", value: "" });
  const [selectedClass, setSelectedClass] = useState<ClassItem>({
    name: "",
    value: "",
  });

  const fetchClasses = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await getClasses();
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
    fetchClasses();
  }, []);

  const handleSaveClass = async () => {
    if (!newClass.name || !newClass.value) {
      Swal.fire({ title: "Both Class Name and Value are required" });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await addNewClass(newClass);
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

  const handleEditClass = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setShowEditClass(true);
  };

  const handleDeleteClass = async (id?: string) => {
    if (!id) return;

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
          const response = await deleteClass(id);
          if (isValidResponse(response)) {
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
      console.error(error);
    }
  };

  const handleSaveClassEdit = async () => {
    try {
      if (!selectedClass.name || !selectedClass.value) {
        Swal.fire({ title: "Both Class Name and Value are required" });
        return;
      }
      const response = await editClass(selectedClass);
      if (isValidResponse(response)) {
        setClasses(response?.data?.classes);
        setShowEditClass(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Paper sx={{ maxWidth: 400 }} elevation={3}>
        <List
          sx={{
            overflowY: "auto",
            m: 0,
            pt: 1,
          }}
          subheader={
            <ListSubheader
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                bgcolor: "#608BC1",
                p: 1,
                borderRadius: 2,
              }}
            >
              <Typography sx={{ color: "#fff" }}>Classes</Typography>
              <IconButton onClick={() => setShowAddClass(true)}>
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </ListSubheader>
          }
        >
          {classes.map((classItem) => (
            <ListItem
              key={classItem._id}
              sx={{
                p: 0,
                m: 0,
              }}
            >
              <ListItemButton>
                <ListItemText primary={classItem.name} />
                <IconButton onClick={() => handleEditClass(classItem)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteClass(classItem._id)}>
                  <Delete />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
      {/* Add Class Modal */}
      <CustomModal
        open={showAddClass}
        height="auto"
        width="auto"
        onClose={() => setShowAddClass(false)}
      >
        <Box
          sx={{
            display: "grid",
            rowGap: 2,
            minWidth: { sm: 250, md: 350 },
            pt: 2,
          }}
        >
          <TextField
            fullWidth
            label="Class Name"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Value"
            value={newClass.value}
            onChange={(e) =>
              setNewClass({ ...newClass, value: e.target.value })
            }
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
        <Box
          sx={{
            display: "grid",
            rowGap: 2,
            minWidth: { sm: 250, md: 350 },
            pt: 2,
          }}
        >
          <TextField
            fullWidth
            label="Class Name"
            value={selectedClass.name}
            onChange={(e) =>
              setSelectedClass({ ...selectedClass, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Value"
            value={selectedClass.value}
            onChange={(e) =>
              setSelectedClass({ ...selectedClass, value: e.target.value })
            }
          />
          <Button variant="contained" onClick={handleSaveClassEdit}>
            Save
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default AcademicInfo;
