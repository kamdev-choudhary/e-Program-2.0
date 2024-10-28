import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useWebSocket } from "../WebSocketContext";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemAvatar,
  FormControl,
  OutlinedInput,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Keyboard as KeyboardIcon,
} from "@mui/icons-material";
import { useGlobalProvider } from "../GlobalProvider";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ChatContent(props) {
  const socket = [];
  //   const socket = useWebSocket();
  const { userId } = useGlobalProvider();
  const { selectedUserId } = props;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newChat, setNewChat] = useState(true);
  const [chatUser, setChatUser] = useState({});
  const [liveChat, setLiveChat] = useState([]);

  useEffect(() => {
    const getChat = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/chats/${userId}/${selectedUserId}`
        );
        if (response.status === 200 && response.data.chats !== null) {
          setLiveChat(response.data?.chats?.messages);
          // setLiveChat(response.data?.chats?.messages);
        } else {
          setLiveChat([]);
        }
        setNewChat(response.data.chats === null);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    const getChatUser = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/chats/getuser/${selectedUserId}`
        );
        if (response.status === 200) {
          setChatUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching chat user:", error);
      }
    };

    getChatUser();
    getChat();
  }, [userId, selectedUserId]);

  useEffect(() => {
    socket.on("chat message", (msg, senderId, receiverId) => {
      if (
        (selectedUserId === receiverId && userId === senderId) ||
        (selectedUserId === senderId && userId === receiverId)
      ) {
        const newMessage = {
          content: msg,
          sender: senderId,
          timestamp: Date.now(),
        };
        setLiveChat((prevMessages) => [newMessage, ...prevMessages]);
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket, selectedUserId]); // Empty dependency array ensures this effect runs only once, on component mount

  const sendMessage = async () => {
    socket.emit("chat message", message, userId, selectedUserId);
    setMessage("");

    // try {
    //   if (newChat) {
    //     await axios.post(
    //       `${API_URL}/chats/newchat/${userId}/${selectedUserId}`,
    //       updatedMessages
    //     );
    //     setNewChat(false);
    //   } else {
    //     await axios.post(
    //       `${API_URL}/chats/newmessage/${userId}/${selectedUserId}`,
    //       newMessage
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error sending message:", error);
    // }
  };

  const getTimeFromDate = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ borderBottom: 1, marginBottom: 1 }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" />
            </ListItemAvatar>
            <ListItemText primary={chatUser.name} secondary="Secondary" />
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        </List>
        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column-reverse",
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          {liveChat?.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender !== userId ? "flex-start" : "flex-end",
              }}
            >
              <Box
                sx={{
                  backgroundColor:
                    message.sender === userId ? "#1976d2" : "#fff",
                  color: message.sender === userId ? "#fff" : "#000",
                  display: message.sender === userId ? "flex" : "block",
                  justifyContent: "flex-end",
                  padding: "6px 15px ",
                  boxShadow: 2,
                  marginTop: 1,
                  minWidth: 50,
                  borderRadius: 2,
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
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "baseline",
            paddingLeft: 2,
            paddingRight: 2,
          }}
        >
          <FormControl
            fullWidth
            sx={{
              m: 1,
              borderRadius: 10,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderColor: "#000",
            }}
          >
            <OutlinedInput
              sx={{
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              }}
              value={message}
              id="outlined-adornment-amount"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
              startAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <KeyboardIcon />
                  </IconButton>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "#28844f" }}
                    onClick={sendMessage}
                    disabled={message.trim() === ""}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{ style: { padding: "12px 14px" } }}
            />
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
