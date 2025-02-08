import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  ListItemButton,
  Divider,
  List,
  ListItemText,
  Box,
  CircularProgress,
  ListItemIcon,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  AndroidRounded,
  DesktopWindowsRounded,
  IsoRounded,
  LaptopWindowsRounded,
  LogoutRounded,
} from "@mui/icons-material";
import axios from "../../../../hooks/AxiosInterceptor";
import { useNotification } from "../../../../contexts/NotificationProvider";

interface UserProps {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
}

interface UserSessionProps {
  user?: UserProps | null;
}

interface SessionProps {
  _id: string;
  token: string;
  ip: string;
  deviceId: string;
  browser: string;
  platform: string;
}

const Sessions: React.FC<UserSessionProps> = ({ user }) => {
  const [sessions, setSessions] = useState<SessionProps[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();

  const getSession = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/auth/session/${user?._id}`);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    getSession();
  }, [user]);

  const handleDeleteSession = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await axios.delete(`/auth/session/${id}`);
        if (!sessions) return;
        setSessions((prev) => {
          if (!prev) return []; // Ensure an empty array is returned if prev is null or undefined
          return prev.filter((s) => s.deviceId !== id); // Remove the session with the given id
        });
        showNotification({
          message: "Session has been logged out.",
          type: "success",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the session.",
        "error"
      );
    }
  };

  const getIconForSession = (platform: string) => {
    switch (platform) {
      case "Windows":
      case "Linux":
      case "Mac":
        return <LaptopWindowsRounded sx={{ color: "#28844f" }} />;
      case "Android":
        return <AndroidRounded sx={{ color: "#914D7E" }} />;
      case "iOS":
        return <IsoRounded />;
      default:
        return <DesktopWindowsRounded />;
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
        Sessions
      </Typography>
      <Divider />
      <Box>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={25} />
          </Box>
        ) : (
          <List sx={{ p: 1, m: 0 }}>
            {sessions && sessions.length > 0 ? (
              sessions.map((session, index) => (
                <React.Fragment key={index}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      p: { xs: 0.5, sm: 1 },
                    }}
                  >
                    <ListItemIcon>
                      {getIconForSession(session.platform)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${session.browser} (${session.platform})`}
                      secondary={session.ip}
                    />
                    <Button
                      startIcon={<LogoutRounded />}
                      color="error"
                      variant="contained"
                      onClick={() => handleDeleteSession(session.deviceId)}
                    >
                      Logout
                    </Button>
                  </ListItemButton>
                  {index < sessions.length - 1 && <Divider />}{" "}
                  {/* Divider between items */}
                </React.Fragment>
              ))
            ) : (
              <Box>
                <Typography>No session available.</Typography>
              </Box>
            )}
          </List>
        )}
      </Box>
    </Card>
  );
};

export default Sessions;
