import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import { useGlobalContext } from "../../contexts/GlobalProvider";

const Profile: React.FC = () => {
  const { user } = useGlobalContext();

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
              <Typography variant="body1">{user?.email || "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Role:
              </Typography>
              <Typography variant="body1">{user?.role || "N/A"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
