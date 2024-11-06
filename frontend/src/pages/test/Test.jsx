import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ChatContent from "./Chaton";

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { text: currentMessage, sender: "me" }]);
      setCurrentMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "80vh",
        bgcolor: "#f0f2f5",
      }}
    >
      {/* Chat List Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          maxHeight: { xs: "30vh", md: "100vh" },
          overflowY: "auto",
          borderRight: { md: "1px solid #ddd" },
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Chats
        </Typography>
        <Divider />
        <List>
          {/* Placeholder for Chat List */}
          <ListItem button>
            <ListItemText primary="Chat with Alice" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Chat with Bob" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Chat with Charlie" />
          </ListItem>
        </List>
      </Box>

      {/* Chat Content Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <ChatContent />
      </Box>
    </Box>
  );
}

export default ChatApp;
