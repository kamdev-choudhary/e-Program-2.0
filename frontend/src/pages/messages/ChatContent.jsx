import { Box, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useGlobalProvider } from "../../GlobalProvider";
import axios from "axios";
import { API_URL } from "../../constants/helper";

function ChatContent({ currentChatId, currentChatUserId, newChat }) {
  const dispactch = useDispatch();
  const { user, isValidResponse } = useGlobalProvider();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const getUserDetails = async () => {
    const response = await axios.get(`${API_URL}/user/${currentChatUserId}`);
    try {
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = () => {};

  return (
    <>
      <Box
        sx={{
          p: 2,
          overflowY: "auto",
          height: "calc(77vh - 64px)",
          borderLeft: "1px solid rgba(0,0,0,0.1)",
          flexGrow: 1,
        }}
      >
        {messages?.map((message, index) => (
          <Box key={index}>
            <span>
              <strong>{message.sender}: </strong>
              {message.text}
            </span>
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
