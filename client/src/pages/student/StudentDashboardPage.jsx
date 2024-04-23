import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/Auth";
import UpdateStudentProfile from "../../components/UpdateStudentProfile";

import { Grid, Box, Typography } from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function DashboardPage() {
  const { userId } = useAuth();
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/auth/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUser(data.user))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <>
      {user && !user.isProfileUpdated && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Box
              sx={{
                marginBottom: 1,
                padding: 2,
                borderRadius: 3,
                border: "2px solid rgba(0,0,0,0.3)",
                backgroundColor: "#F8D87E",
              }}
            >
              <Typography>
                Update Your profile to get Dashboard Data and appear on online
                exams
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
