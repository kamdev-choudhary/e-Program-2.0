import {
  Box,
  TextField,
  Button,
  Card,
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { useGlobalProvider } from "../../GlobalProvider";
import axios from "axios";
import { API_URL } from "../../constants/helper";
import { MoreVert } from "@mui/icons-material";

const ChatContent = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const {
    currentChatId,
    currentChatUserId,
    newChat,
    setNewChat,
    setShowUsersList,
  } = props;
  const { user, isValidResponse } = useGlobalProvider();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);

  const getUserDetails = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${API_URL}/user/${currentChatUserId}`);
      if (isValidResponse(response)) {
        setSelectedUser(response?.data?.user);
        setShowUsersList(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchMessages = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.get(
        `${API_URL}/chat/messages/${currentChatId}`
      );
      if (isValidResponse(response)) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
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
      dispatch({ type: "SET_LOADING", payload: true });
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
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createChatAndSend = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(`${API_URL}/chat/create`, {
        id1: user?.userId,
        id2: currentChatUserId,
        content: currentMessage,
        groudId: currentChatId,
      });
      if (isValidResponse(response)) {
        setMessages(response?.data?.messages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: true });
    }
  };

  const handleSendMessage = () => {
    if (newChat) {
      createChatAndSend();
    } else {
      send();
    }
  };

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    fetchMessages,
    send,
  }));

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "red" }}>{selectedUser?.name?.[0]}</Avatar>
          }
          action={
            <IconButton>
              <MoreVert />
            </IconButton>
          }
          title={selectedUser?.name}
          subheader="Online"
        />
      </Card>
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
              {message.content}
            </Box>
          </Box>
        ))}
      </Box>

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
          size="small"
        />
        <Button variant="contained" sx={{ ml: 1 }} onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </>
  );
});

export default ChatContent;
