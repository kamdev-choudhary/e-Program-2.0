import React, { useState } from "react";
import {
  Box,
  Fab,
  TextField,
  Button,
  Typography,
  Paper,
  Drawer,
  IconButton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const ChatbotWithFAB: React.FC = () => {
  const [open, setOpen] = useState(false); // Controls drawer visibility
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const toggleDrawer = () => setOpen(!open);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput(""); // Clear input

    try {
      // Make API request to OpenAI (replace YOUR_API_KEY with your key)
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_API_KEY`,
            "Content-Type": "application/json",
          },
        }
      );
      // Add AI response to the chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={toggleDrawer}
        sx={{ position: "fixed", bottom: 25, right: 25 }}
        size="medium"
      >
        <ChatIcon />
      </Fab>

      {/* Chatbot Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 300,

            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">AI Chatbot</Typography>
            <IconButton color="error" onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Paper
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              mb: 2,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor:
                      msg.sender === "user" ? "primary.main" : "grey.300",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Input Field */}
          <Box component="form" onSubmit={handleSend}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              variant="outlined"
              sx={{ mb: 1 }}
              size="small"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatbotWithFAB;
