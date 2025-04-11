import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Drawer,
  IconButton,
  Avatar,
  Slide,
  useScrollTrigger,
  styled,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import axios from "axios";

const StyledButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  right: 0,
  top: "50%",
  transform: "translateY(-50%)",
  writingMode: "vertical-rl",
  padding: theme.spacing(2),
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  zIndex: 999,
  transition: "all 0.3s ease",
  "&:hover": {
    right: theme.spacing(0.5),
    transform: "translateY(-50%) scale(1.05)",
  },
}));

const ChatbotWithFAB: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const trigger = useScrollTrigger();

  const toggleDrawer = () => setOpen(!open);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
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

      const botMessage = {
        sender: "bot",
        text: response.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    }
  };

  return (
    <>
      <Slide appear={false} direction="left" in={!trigger && !open}>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={toggleDrawer}
          size="small"
        >
          AI Assistant
        </StyledButton>
      </Slide>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 350,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <SmartToyOutlinedIcon sx={{ color: "#fff" }} />
              </Avatar>
              <Typography variant="h6">AI Assistant</Typography>
            </Box>
            <IconButton size="small" onClick={toggleDrawer} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>

          <Paper
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              borderRadius: 0,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: 3,
                bgcolor: "primary.main",
              },
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      msg.sender === "user"
                        ? "primary.main"
                        : "background.default",
                    color: msg.sender === "user" ? "white" : "text.primary",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>

          <Box
            component="form"
            onSubmit={handleSend}
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 20,
                    bgcolor: "background.paper",
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatbotWithFAB;
