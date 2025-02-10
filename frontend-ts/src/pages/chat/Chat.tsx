import { Card, Grid2 as Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Messages from "./Messages";
import ChatList from "./ChatList";

import { UserChatListProps } from "./types";

const Chat: React.FC = () => {
  const [chatList, setChatList] = useState<UserChatListProps[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<UserChatListProps | null>(
    null
  );

  useEffect(() => {
    setChatList([
      {
        name: "Aman",
        lastMessage: "Hello!",
        profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        name: "Riya",
        lastMessage: "How are you?",
        profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        name: "Vikram",
        lastMessage: "See you soon!",
        profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        name: "Priya",
        lastMessage: "Good morning!",
        profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      {
        name: "Rahul",
        lastMessage: "Call me later.",
        profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      {
        name: "Sneha",
        lastMessage: "What's up?",
        profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
      },
      {
        name: "Karan",
        lastMessage: "Let's catch up!",
        profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
      },
      {
        name: "Anjali",
        lastMessage: "Long time no see.",
        profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
      },
      {
        name: "Rohit",
        lastMessage: "I'm on my way.",
        profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
      },
      {
        name: "Neha",
        lastMessage: "Thanks a lot!",
        profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
      },
    ]);
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <Grid sx={{ height: "100%" }} container spacing={2}>
        <Grid sx={{ height: "100%" }} size={{ xs: 12, md: 4 }}>
          <ChatList setSelectedChat={setSelectedChat} chatList={chatList} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Messages selectedChat={selectedChat} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default Chat;
