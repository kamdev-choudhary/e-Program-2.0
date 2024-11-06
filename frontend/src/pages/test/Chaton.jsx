import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

function Chaton() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, { text: currentMessage, sender: "me" }]);
      setCurrentMessage("");
    }
  };
  return (
    <>
      {/* Messages Display */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: "#e5ddd5",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {messages?.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.sender === "me" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: message.sender === "me" ? "#dcf8c6" : "#ffffff",
                p: 1,
                borderRadius: 2,
                maxWidth: "70%",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
              }}
            >
              {message.text}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: "flex",
          p: 1,
          borderTop: "1px solid rgba(0,0,0,0.1)",
          bgcolor: "#ffffff",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type a message"
          fullWidth
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button variant="contained" sx={{ ml: 1 }} onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </>
  );
}

export default Chaton;
