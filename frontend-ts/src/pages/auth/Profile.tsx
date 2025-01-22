import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Grid2 as Grid,
  Button,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import dummyProfile from "../../assets/user.jpg";
import { CustomModal } from "../../components/CustomModal";
import axios from "../../hooks/AxiosInterceptor";
import { EditRounded, UploadFileRounded } from "@mui/icons-material";
import { LOCAL_STORAGE_KEYS } from "../../constant/constants";

const Profile: React.FC = () => {
  const { user, profilePicUrl, isValidResponse, setProfilePicUrl } =
    useGlobalContext();
  const [showUpdateProfilePic, setShowUpdateProfilePic] =
    useState<boolean>(false);
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
      if (isValidResponse(response)) {
        setProfilePicUrl(response.data.profilePicUrl);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.PHOTO,
          response.data.profilePicUrl
        );
        setPreviewUrl("");
        setNewProfilePic(null);
        setShowUpdateProfilePic(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { sm: "column", lg: "row" },
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          // maxWidth: 600,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
          Basic Info
        </Typography>
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={profilePicUrl || dummyProfile}
                  alt="profile-pic"
                  style={{
                    maxHeight: 150,
                    borderRadius: "50%",
                    aspectRatio: "1 / 1",
                    maxWidth: 150,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Button
                  startIcon={<EditRounded />}
                  sx={{ px: 4 }}
                  onClick={() => setShowUpdateProfilePic(true)}
                >
                  Edit
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Name:
                  </Typography>
                  <Typography variant="body1">{user?.name || "N/A"}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Email:
                  </Typography>
                  <Typography variant="body1">
                    {user?.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Role:
                  </Typography>
                  <Typography variant="body1">{user?.role || "N/A"}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Update Profile Pic */}
      <CustomModal
        open={showUpdateProfilePic}
        onClose={() => {
          setShowUpdateProfilePic(false);
          setPreviewUrl("");
          setNewProfilePic(null);
        }}
        showHeader={false}
        height="auto"
        width="auto"
      >
        <Box sx={{ minWidth: 250 }}>
          <Box>
            <OutlinedInput type="file" onChange={handleFileChange} />
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
              src={previewUrl || dummyProfile}
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
      </CustomModal>
    </Box>
  );
};

export default Profile;
