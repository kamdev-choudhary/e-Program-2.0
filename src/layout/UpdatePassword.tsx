import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import React from "react";

const UpdatePassword: React.FC = () => {
  return (
    <Box
      sx={{ minWidth: 250, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h6">Update Password</Typography>
      <Divider />
      <TextField fullWidth label="Enter OTP" />
      <Button variant="contained">Submit OTP</Button>
    </Box>
  );
};

export default UpdatePassword;
