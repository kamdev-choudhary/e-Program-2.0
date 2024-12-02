import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { Image, Add as AddIcon } from "@mui/icons-material";
import { CustomModal } from "../../components/CustomModal";
import { useGlobalProvider } from "../../GlobalProvider";
import ScrollableTabs from "../../components/ScrollableTabs";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { icons } from "../../constants/helper";
import ChatContent from "./ChatContent";
import { useDispatch } from "react-redux";
import { getChats } from "../../api/chat";
import { getUsersByRole } from "../../api/user";

const tabs = [
  { name: "Admin", value: "admin", icon: icons.admin },
  { name: "Scholars", value: "student", icon: icons.users },
];

function Messages() {
  const { user, isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const chatContentRef = useRef();
  const [chats, setChats] = useState([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("admin");
  const [currentChatUserId, setCurrentChatUserId] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [newChat, setNewChat] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchUsersByRole = async ({ role }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getUsersByRole({ role: role });
      if (isValidResponse(response)) {
        setUsers(response?.data?.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchChats = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getChats({ user: user });
      if (isValidResponse(response)) {
        setChats(response?.data?.chats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchUsersByRole({ role: selectedTab });
  }, [selectedTab]);

  const handleChatClick = async (userId) => {
    try {
      setCurrentChatUserId(userId);
      const chat = chats?.find((c) => {
        return c.participants.some((p) => p?._id === userId);
      });
      if (!chat) {
        setNewChat(true);
      } else {
        setNewChat(false);
        setCurrentChatId(chat._id);
        if (chatContentRef.current) {
          chatContentRef.current.fetchMessages();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columnsForUsers = [
    { field: "id", headerName: "SN", width: 50 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },

    ...(selectedTab === "5"
      ? [
          { field: "coe_name", headerName: "CoE Name", flex: 1 },
          { field: "batch_name", headerName: "Batch Name", flex: 1 },
          { field: "section_name", headerName: "Section Name", flex: 1 },
        ]
      : []),
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            onClick={() => handleChatClick(params?.row?._id)}
          >
            Message
          </Button>
        </>
      ),
    },
  ];

  const rowsForUser = useMemo(() => {
    return users?.map((u, index) => ({
      id: index + 1,
      ...u,
    }));
  }, [users]);

  return (
    <>
      <Box
        component={Paper}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "80vh",
        }}
      >
        {/* Chat List Panel */}
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            maxHeight: { xs: "30vh", md: "100vh" },
            overflowY: "auto",
            borderRight: { md: "1px solid #ddd" },
            position: "relative",
          }}
        >
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Search Chat"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Box>
          <Divider />
          <Box sx={{ p: 1 }}>
            {chats?.map((chat, index) => (
              <List
                dense={true}
                key={index}
                sx={{
                  cursor: "pointer",
                  bgcolor: currentChatId === chat?._id ? "#CDC1FF" : "",
                  borderRadius: 3,
                  m: 0,
                  p: 1,
                }}
              >
                <ListItem onClick={() => handleChatClick(chat.participant._id)}>
                  <ListItemAvatar>
                    <Avatar>
                      <Image />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={chat?.participant?.name} />
                </ListItem>
              </List>
            ))}
          </Box>
          <Fab
            size="small"
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
            }}
            color="primary"
            onClick={() => setShowUsersList(true)}
          >
            <AddIcon />
          </Fab>
        </Box>

        {/* Chat Content Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {currentChatUserId && (
            <ChatContent
              ref={chatContentRef}
              currentChatId={currentChatId}
              currentChatUserId={currentChatUserId}
              newChat={newChat}
              setNewChat={setNewChat}
              setShowUsersList={setShowUsersList}
            />
          )}
        </Box>
      </Box>
      {/* Users */}
      <CustomModal
        open={showUsersList}
        onClose={() => setShowUsersList(false)}
        autoClose={true}
        header="User List"
      >
        <ScrollableTabs
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Box component={Paper}>
          <DataGrid
            columns={columnsForUsers}
            rows={rowsForUser}
            slots={{ toolbar: () => <CustomToolbar showAddButton={false} /> }}
          />
        </Box>
      </CustomModal>
    </>
  );
}

export default Messages;
