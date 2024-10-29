import React, { useState, useMemo, useEffect } from "react";
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
import Grid from "@mui/material/Grid2";
import { Image, Add as AddIcon } from "@mui/icons-material";
import { CustomModal } from "../../components/CustomModal";
import { useGlobalProvider } from "../../GlobalProvider";
import ScrollableTabs from "../../components/ScrollableTabs";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../../components/CustomToolbar";
import { API_URL, icons } from "../../constants/helper";
import { useWebSocket } from "../../websocketContext";
import ChatContent from "./ChatContent";
import { useDispatch } from "react-redux";
import axios from "axios";

const tabs = [
  { name: "Admin", value: "admin", icon: icons.admin },
  { name: "Scholars", value: "student", icon: icons.users },
];

function Messages() {
  const { user, isValidResponse } = useGlobalProvider();
  const dispatch = useDispatch();
  const socket = useWebSocket();
  const [chats, setChats] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("admin");
  const [currentChatUserId, setCurrentChatUserId] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [newChat, setNewChat] = useState(false);

  const getUsersByRole = async ({ role }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${API_URL}/user/role/${role}`);
      if (isValidResponse(response)) {
        setUsers(response?.data?.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getChats = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${API_URL}/chat/${user?.userId}`);
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
    getChats();
  }, []);

  useEffect(() => {
    getUsersByRole({ role: selectedTab });
  }, [selectedTab]);

  const handleChatClick = async (userId) => {
    try {
      setCurrentChatUserId(userId);
      const chat = chats?.find((c) => {
        return c.participants.some((p) => p._id === userId);
      });
      console.log(chat);
      if (!chat) {
        setNewChat(true);
      } else {
        setNewChat(false);
        setCurrentChatId(chat._id);
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
          flexDirection: "row",
          height: "79vh",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            lg={3}
            sx={{
              borderRight: "1px solid rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            <Box sx={{ p: 1, overflowY: "auto", height: "77vh" }}>
              <TextField fullWidth size="small" label="Search" />
              <Divider sx={{ my: 1 }} />
              {chats?.map((chat, index) => (
                <List key={index}>
                  <ListItem
                    button
                    onClick={() => handleChatClick(chat.participant._id)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Image />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={chat?.participant?.name} />
                  </ListItem>
                </List>
              ))}
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
          </Grid>
          <Grid
            size={{ xs: 12, md: 6, lg: 6 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <ChatContent
              currentChatId={currentChatId}
              currentChatUserId={currentChatUserId}
              newChat={newChat}
              setNewChat={setNewChat}
              setShowUsersList={setShowUsersList}
            />
          </Grid>
        </Grid>
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
      </Box>
    </>
  );
}

export default Messages;
