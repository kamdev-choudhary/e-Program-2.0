import {
  Box,
  Divider,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
} from "@mui/material";
import React from "react";

interface Student {
  _id: string;
  email: string;
  name: string;
  mobile: string;
}

interface StudentDetailsProps {
  scholar: Student | null;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ scholar }) => {
  if (!scholar) {
    return (
      <Typography variant="h6" color="textSecondary">
        No Scholar data available
      </Typography>
    );
  }

  return (
    <Card sx={{ margin: "auto", boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Basic Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Name:
              </Typography>
              <Typography variant="body1">{scholar.name}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Email:
              </Typography>{" "}
              <Typography variant="body1">{scholar.email}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Mobile:
              </Typography>
              <Typography variant="body1">{scholar.mobile}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <Typography variant="subtitle1" fontWeight="bold">
                ID:
              </Typography>
              <Typography variant="body1">{scholar._id}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StudentDetails;
