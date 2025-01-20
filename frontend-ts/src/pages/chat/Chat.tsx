import { Card, Grid2 as Grid } from "@mui/material";
import React from "react";
import Messages from "./Messages";
import ChatList from "./ChatList";

const Chat: React.FC = () => {
  return (
    <Card sx={{ height: "100%", display: "flex" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChatList />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Messages />
        </Grid>
      </Grid>
    </Card>
  );
};

export default Chat;
