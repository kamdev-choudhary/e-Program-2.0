import React from "react";
import { Box, Divider, TextField, Typography } from "@mui/material";

const Books: React.FC = () => {
  return (
    <Box>
      <Box>
        <Typography variant="h4"> Books</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <TextField label="Search Book" fullWidth />
      </Box>
    </Box>
  );
};

export default Books;
