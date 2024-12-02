import React, { useState } from "react";
import { Box, IconButton, Button, OutlinedInput } from "@mui/material";
import { useGlobalProvider } from "../GlobalProvider";
import { CustomModal } from "../components/CustomModal";
import { EditRounded, VisibilityRounded } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { uploadProfilePic } from "../api/user";

function ProfilePic({ expanded }) {
  const { user, deviceTheme, photo, isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showUpdatePic, setShowUpdatePic] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null); // Store Base64 image here

  const isDarkMode = deviceTheme === "dark";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const backgroundColor = isDarkMode ? "#424242" : "#f0f0f0";
  const initials = `${user?.name?.[0] || ""}${
    user?.name?.split(" ")?.[1]?.[0] || ""
  }`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPhoto(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePic = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      if (newPhoto) {
        const response = await uploadProfilePic({
          user: user,
          photo: newPhoto,
        });
        if (isValidResponse(response)) {
          setShowUpdatePic(false);
          localStorage.setItem("photo", newPhoto);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <>
      <Box
        sx={{
          height: expanded ? 95 : 38,
          width: expanded ? 95 : 38,
          border: `1px solid ${borderColor}`,
          borderRadius: "50%",
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          fontSize: 40,
          fontWeight: "bold",
          color: "#4CAF50",
          backgroundImage: photo ? `url(${photo})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "top",
          cursor: "pointer",
          "&:hover .profile-actions": {
            display: "flex !important", // Show the buttons on hover
          },
        }}
      >
        {!photo && (
          <>
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {initials}
            </span>
          </>
        )}
        <div
          className="profile-actions"
          style={{
            position: "absolute",
            bottom: "10px", // Place the buttons at the bottom of the box
            width: "100%",
            display: "none", // Hide by default
            justifyContent: "center",
            gap: "10px",
            padding: "0 10px",
          }}
        >
          <IconButton onClick={() => setShowProfilePic(true)} color="primary">
            <VisibilityRounded />
          </IconButton>
          <IconButton onClick={() => setShowUpdatePic(true)}>
            <EditRounded />
          </IconButton>
        </div>
      </Box>

      <CustomModal
        open={showProfilePic}
        onClose={() => setShowProfilePic(false)}
        height="auto"
        width="auto"
        showHeader={false}
      >
        <img src={photo} alt="Profile" />
      </CustomModal>

      <CustomModal
        open={showUpdatePic}
        onClose={() => setShowUpdatePic(false)}
        showHeader={false}
        height="auto"
        width="auto"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 2,
          }}
        >
          <OutlinedInput
            onChange={handleFileChange}
            type="file"
            accept="image/*"
          />

          {newPhoto && (
            <img
              src={newPhoto}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfilePic}
            disabled={!newPhoto}
          >
            Update Profile Picture
          </Button>
        </Box>
      </CustomModal>
    </>
  );
}

export default ProfilePic;
