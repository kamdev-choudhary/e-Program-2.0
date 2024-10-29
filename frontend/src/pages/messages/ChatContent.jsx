import { Box, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGlobalProvider } from "../../GlobalProvider";
import axios from "axios";
import { API_URL } from "../../constants/helper";

function ChatContent({
  currentChatId,
  currentChatUserId,
  newChat,
  setNewChat,
  setShowUsersList,
}) {
  const dispactch = useDispatch();
  const { user, isValidResponse } = useGlobalProvider();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);

  const getUserDetails = async () => {
    const response = await axios.get(`${API_URL}/user/${currentChatUserId}`);
    if (isValidResponse(response)) {
      setSelectedUser(response?.data?.user);
      setShowUsersList(false);
    }
    try {
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/chat/messages/${currentChatId}`
      );
      if (isValidResponse(response)) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentChatId]);

  useEffect(() => {
    if (!currentChatUserId) {
      return;
    } else {
      getUserDetails();
    }
  }, [currentChatUserId]);

  const send = async () => {
    try {
      const response = await axios.post(`${API_URL}/chat/send`, {
        id1: user?.userId,
        id2: currentChatUserId,
        chatId: currentChatId,
        content: currentMessage,
        groupId: currentChatId,
      });
      if (isValidResponse(response)) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createChatAndSend = async () => {
    try {
      const response = await axios.post(`${API_URL}/chat/create`, {
        id1: user?.userId,
        id2: currentChatUserId,
        content: currentMessage,
        groudId: currentChatId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = () => {
    if (newChat) {
      createChatAndSend();
      console.log("new Chat");
    } else {
      send();
      console.log("old Chat");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse", // This will map from bottom to top
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "1rem",
          backgroundColor: "#e5ddd5",
          borderRadius: 2,
          flex: 1,
        }}
      >
        {messages?.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                message.sender !== user?.userId ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                bgcolor:
                  message.sender !== user?.userId ? "#dcf8c6" : "#ffffff",
                color: "#333",
                borderRadius: 2,
                padding: "8px 12px",
                // maxWidth: "70%",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
              }}
            >
              <span>{message.content}</span>
              <Box
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  color: "#888",
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                }}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 1,
          borderTop: "1px solid rgba(0,0,0,0.1)",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          columnGap: 2,
        }}
      >
        <TextField
          multiline
          maxRows={3}
          size="small"
          label="Type a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button onClick={handleSendMessage} variant="contained">
          Send
        </Button>
      </Box>
    </>
  );
}

export default ChatContent;
