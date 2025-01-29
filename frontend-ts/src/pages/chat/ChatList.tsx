import { AddRounded, SearchRounded } from "@mui/icons-material";
import { Box, Fab, InputAdornment, OutlinedInput } from "@mui/material";
import React from "react";

const ChatList: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        p: 2,
      }}
    >
      {/* Search Input */}
      <OutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <SearchRounded />
          </InputAdornment>
        }
        placeholder="Search Chat"
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <AddRounded />
      </Fab>
    </Box>
  );
};

export default ChatList;
