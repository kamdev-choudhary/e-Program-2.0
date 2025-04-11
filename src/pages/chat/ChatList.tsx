import {
  BorderColorRounded,
  FilterListRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { CustomModal } from "../../components/CustomModal";
import { UserChatListProps } from "./types";
import ChatListUser from "./ChatListUser";

interface ChatListProps {
  chatList: UserChatListProps[] | null;
  setSelectedChat: (value: UserChatListProps) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chatList, setSelectedChat }) => {
  const [showUserList, setShowUserList] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const filteredChatList = useMemo(() => {
    return chatList?.filter((chat) =>
      Object.values(chat).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [chatList, searchText]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Typography variant="h6">Chats</Typography>
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={() => setShowUserList(true)}>
            <BorderColorRounded />
          </IconButton>
          <IconButton>
            <FilterListRounded />
          </IconButton>
        </Box>
      </Box>
      {/* Search Input */}
      <OutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <SearchRounded />
          </InputAdornment>
        }
        placeholder="Search Chat"
        fullWidth
        value={searchText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchText(e.target.value)
        }
      />
      <List sx={{ height: "100%", overflow: "auto" }}>
        {filteredChatList && filteredChatList.length > 0 ? (
          filteredChatList?.map((user) => (
            <ListItemButton onClick={() => setSelectedChat(user)}>
              <ListItemAvatar>
                <Avatar src={user.profilePic} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.lastMessage} />
            </ListItemButton>
          ))
        ) : (
          <Typography>No Chat List Found.</Typography>
        )}
      </List>

      {/* User LIst */}
      <CustomModal open={showUserList} onClose={() => setShowUserList(false)}>
        <ChatListUser />
      </CustomModal>
    </Box>
  );
};

export default ChatList;
