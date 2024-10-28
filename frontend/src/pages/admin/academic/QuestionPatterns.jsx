import React, { useEffect, useState } from "react";
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

import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { CustomModal } from "../../../components/CustomModal";
import { useGlobalProvider } from "../../../GlobalProvider";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../../../constants/helper";
import Swal from "sweetalert2";

function QuestionPatterns() {
  const { isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [patterns, setPatterns] = useState([]);
  const [showAddPattern, setShowAddPattern] = useState(false);
  const [newPatternName, setNewPatternName] = useState("");
  const [patternDescription, setPatternDesription] = useState("");

  const getPatterns = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${API_URL}/academic/pattern`);
      if (isValidResponse(response)) {
        setPatterns(response?.data?.patterns);
        setShowAddPattern(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    getPatterns();
  }, []);

  const handleSavePattern = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/academic/pattern`, {
        name: newPatternName,
        description: patternDescription,
      });
      if (isValidResponse(response)) {
        setPatterns(response?.data?.patterns);
        setShowAddPattern(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleEditPatten = () => {};

  const handleDeletePattern = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to rever this.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(
          `${API_URL}/academic/pattern/${id}`
        );
        if (isValidResponse(response)) {
          setPatterns(response?.data?.patterns);
        }
      }
    });
  };

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box component={Paper} sx={{ display: "grid" }}>
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
                Question Patterns
              </Typography>
              <IconButton
                variant="contained"
                onClick={() => setShowAddPattern(true)}
              >
                <AddRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            <Divider />

            <List sx={{ height: 350, overflow: "auto" }}>
              {patterns?.map((pattern, index) => (
                <ListItem key={index} sx={{ justifyContent: "space-between" }}>
                  <Typography>{pattern.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleEditPatten(pattern)}>
                      <EditRounded />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletePattern(pattern?._id)}
                    >
                      <DeleteRounded />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
      {/* Add Pattern */}
      <CustomModal
        open={showAddPattern}
        onClose={() => setShowAddPattern(false)}
        height="auto"
        width="auto"
        header="Add New Pattern"
      >
        <Box sx={{ minWidth: 400, display: "grid", rowGap: 2 }}>
          <TextField
            label="New Pattern Name"
            size="small"
            value={newPatternName}
            onChange={(e) => setNewPatternName(e.target.value)}
          />
          <TextField
            minRows={3}
            placeholder="Pattern Description"
            label="Pattern Description"
            value={patternDescription}
            size="small"
            onChange={(e) => setPatternDesription(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={handleSavePattern}>
            Save
          </Button>
        </Box>
      </CustomModal>
    </>
  );
}

export default QuestionPatterns;
