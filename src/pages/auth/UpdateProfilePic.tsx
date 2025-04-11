import React, { useState } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "../../hooks/AxiosInterceptor";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { LS_KEYS } from "../../constant/constants";
import { UploadFileRounded } from "@mui/icons-material";
const UpdateProfilePic = () => {
  const { user, setProfilePicUrl } = useGlobalContext();
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleUploadProfilePic = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (newProfilePic && user) {
        formData.append("id", user?._id);
        formData.append("photo", newProfilePic);
      } else {
        return;
      }
      const response = await axios.post("/user/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfilePicUrl(response.data.profilePicUrl);
      localStorage.setItem(LS_KEYS.PHOTO, response.data.profilePicUrl);
      setPreviewUrl("");
      setNewProfilePic(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Box sx={{ minWidth: 250 }}>
        <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Update Profile Picture
          </Typography>
        </Box>
        <Box>
          <OutlinedInput
            inputProps={{ accept: "image/*" }}
            type="file"
            onChange={handleFileChange}
          />
        </Box>
      </Box>
      {newProfilePic && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <img
            src={previewUrl || ""}
            alt="profile-pic"
            style={{
              maxHeight: 150,
              borderRadius: "50%",
              aspectRatio: "1 / 1",
              maxWidth: 150,
            }}
          />
          <Button
            disabled={loading}
            onClick={handleUploadProfilePic}
            sx={{ mt: 4 }}
            startIcon={
              loading ? <CircularProgress size={24} /> : <UploadFileRounded />
            }
            variant="contained"
            fullWidth
          >
            Upload
          </Button>
        </Box>
      )}
    </div>
  );
};

export default UpdateProfilePic;
