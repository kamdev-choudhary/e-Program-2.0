import React, { useState } from "react";
import { useGlobalProvider } from "../../GlobalProvider";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { API_URL } from "../../constants/helper";

function Profile() {
  const dispatch = useDispatch();
  const { user, photo, isValidResponse } = useGlobalProvider();
  const [newValue, setNewValue] = useState({});
  const [edit, setEdit] = useState({
    personalInfo: false,
    email: false,
    mobile: false,
  });

  const handleUpdateChanges = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = axios.patch(`${API_URL}/user`, {
        id: user?._id,
        newValue,
      });
      if (isValidResponse(response)) {
        setEdit((prev) => ({ ...prev, name: false }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img
          src={photo}
          height="200px"
          width="200px"
          style={{ borderRadius: 5000 }}
        />
      </Box>
      <Box component={Paper} sx={{ p: 1, my: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          <Typography variant="h6">Personal Info</Typography>
          {edit?.personalInfo ? (
            <Box>
              <Button
                onClick={() => {
                  setNewValue((prev) => ({ ...prev, name: null }));
                  setEdit((prev) => ({ ...prev, personalInfo: false }));
                }}
              >
                Cancel
              </Button>
              <Button>Save</Button>
            </Box>
          ) : (
            <Button
              onClick={() => {
                setEdit((prev) => ({ ...prev, personalInfo: true }));
                setNewValue((prev) => ({
                  ...prev,
                  name: user?.name,
                }));
              }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider />
        {edit?.personalInfo ? (
          <Box>
            <TextField
              value={newValue?.name}
              onChange={(e) =>
                setNewValue((prev) => ({ ...prev, name: e.target.value }))
              }
              size="small"
              label="Name"
            />
          </Box>
        ) : (
          <Box
            sx={{
              p: 1, // Padding
              gap: 1, // Gap between elements
              display: "flex", // Align items flexibly
              flexDirection: "column", // Stack items vertically
            }}
          >
            <Typography variant="body1">Name: {user?.name}</Typography>
            <Typography variant="body1">Email: {user?.email}</Typography>
            <Typography variant="body1">Mobile: {user?.mobile}</Typography>
          </Box>
        )}
      </Box>
    </>
  );
}

export default Profile;
