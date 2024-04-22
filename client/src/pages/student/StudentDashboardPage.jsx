import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/Auth";
import UpdateStudentProfile from "../../components/UpdateStudentProfile";

import { Grid } from "@mui/material";

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
            Update Your Profile
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <UpdateStudentProfile />
          </Grid>
        </Grid>
      )}
    </>
  );
}
