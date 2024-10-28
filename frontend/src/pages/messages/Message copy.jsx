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
import { icons } from "../../constants/helper";
import { useWebSocket } from "../../websocketContext";

const tabs = [
  { name: "Admin", value: "1", icon: icons.admin },
  { name: "Scholars", value: "5", icon: icons.users },
];

const mockFetchChats = (contactName) => {
  return [
    { sender: "You", text: "Hello!" },
    { sender: contactName, text: "Hi there!" },
    { sender: "You", text: "How are you?" },
  ];
};

function Messages() {
  const { user, isValidResponse } = useGlobalProvider();
  const socket = useWebSocket();
  const [chats, setChats] = useState([
    { name: "kD", id_user: "12112" },
    { name: "Alex", id_user: "541" },
    { name: "Sarah", id_user: "1112" },
  ]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [showUsersList, setShowUsersList] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  socket.current?.on("exampleEvent", () => {
    alert("Connected");
  });

  const getUsersByRole = async ({ idRole }) => {};

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsersByRole({ idRole: selectedTab });
      if (isValidResponse(response)) {
        setUsers(response?.data?.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedTab]);

  async function fetchChats() {
    return;
  }

  const handleChatClick = async (index) => {
    try {
      if (index) {
        const chatName = chats[index]?.name;
        const messages = mockFetchChats(chatName);
        setCurrentMessages(messages);
        setActiveChatIndex(index);
      } else {
        const response = await fetchChats();
        if (isValidResponse(response)) {
          setCurrentMessage(response.data.messages);
        }
      }
    } catch (error) {}
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setCurrentMessages((prevMessages) => [
        { sender: "You", text: currentMessage },
        ...prevMessages,
      ]);
      setCurrentMessage("");
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
          <Button>Message</Button>
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
      <p> {socket.current?.id}</p>
      <Box
        sx={{
          bgcolor: "background.paper",
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
              {chats.map((chat, index) => (
                <List key={index}>
                  <ListItem button onClick={() => handleChatClick(index)}>
                    <ListItemAvatar>
                      <Avatar>
                        <Image />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.name}
                      secondary={
                        currentMessages.length > 0 &&
                        chat.name === currentMessages[0]?.sender
                          ? currentMessages[0].text
                          : "No messages yet"
                      }
                    />
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
            item
            xs={12}
            md={9}
            lg={9}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                p: 2,
                overflowY: "auto",
                height: "calc(77vh - 64px)", // Adjust height to leave space for input box
                borderLeft: "1px solid rgba(0,0,0,0.1)",
                flexGrow: 1,
              }}
            >
              {currentMessages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    textAlign: message.sender === "You" ? "right" : "left",
                  }}
                >
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
          </Grid>
        </Grid>
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
