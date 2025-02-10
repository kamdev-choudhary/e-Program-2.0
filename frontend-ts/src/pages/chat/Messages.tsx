import React, { useEffect, useState } from "react";
import { UserChatListProps } from "./types";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVertRounded } from "@mui/icons-material";

import { MessagesListProps } from "./types";

interface MessagesProps {
  selectedChat: UserChatListProps | null;
}

const Messages: React.FC<MessagesProps> = ({ selectedChat }) => {
  const [lastSeen, setLastSeen] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [messages, setMessages] = useState<MessagesListProps[] | null>(null);

  useEffect(() => {
    setLastSeen("Recently");
    setMessages(null);
  }, []);

  return (
    <div>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={selectedChat?.profilePic} />
        </ListItemAvatar>
        <ListItemText primary={selectedChat?.name} secondary={lastSeen} />
        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          id="user-more-menu"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(e.currentTarget)
          }
        >
          <MoreVertRounded />
        </IconButton>
      </ListItem>

      {/* Menu with proper positioning */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{ minWidth: 250 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
      </Menu>
      <Box>
        {messages && messages?.map((message) => <Box>{message.content}</Box>)}
      </Box>
    </div>
  );
};

export default Messages;
