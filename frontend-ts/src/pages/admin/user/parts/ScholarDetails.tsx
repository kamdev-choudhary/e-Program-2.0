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

interface ScholarDetailsProps {
  student: Student | null;
}

const ScholarDetails: React.FC<ScholarDetailsProps> = ({ student }) => {
  if (!student) {
    return (
      <Typography variant="h6" color="textSecondary">
        No student data available
      </Typography>
    );
  }

  return (
    <Card sx={{ margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
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
              <Typography variant="body1">{student.name}</Typography>
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
              <Typography variant="body1">{student.email}</Typography>
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
              <Typography variant="body1">{student.mobile}</Typography>
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
              <Typography variant="body1">{student._id}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ScholarDetails;
