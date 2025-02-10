import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Grid2 as Grid,
  Button,
} from "@mui/material";
import { useGlobalContext } from "../../contexts/GlobalProvider";
import { CustomModal } from "../../components/CustomModal";
import { EditRounded } from "@mui/icons-material";
import Sessions from "../admin/user/parts/Sessions";
import ScholarDetails from "./ScholarDetails";
import UpdateProfilePic from "./UpdateProfilePic";

const Profile: React.FC = () => {
  const { user, profilePicUrl } = useGlobalContext();
  const [showUpdateProfilePic, setShowUpdateProfilePic] =
    useState<boolean>(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Basic Info Card */}
      <Card
        sx={{
          width: "100%",
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
                  src={profilePicUrl}
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
                  <Typography sx={{ color: "text.secondary" }} variant="body1">
                    {user?.name || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Email:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }} variant="body1">
                    {user?.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Role:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }} variant="body1">
                    {user?.role || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Mobile:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }} variant="body1">
                    {user?.mobile || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sessions Card */}
      <Sessions user={user} />

      {/* Scholar Details */}
      {user?.role === "scholar" && <ScholarDetails user={user} />}

      {/* Update Profile Pic Modal */}
      <CustomModal
        open={showUpdateProfilePic}
        onClose={() => {
          setShowUpdateProfilePic(false);
        }}
        showHeader={false}
        height="auto"
        width="auto"
      >
        <UpdateProfilePic />
      </CustomModal>
    </Box>
  );
};

export default Profile;
