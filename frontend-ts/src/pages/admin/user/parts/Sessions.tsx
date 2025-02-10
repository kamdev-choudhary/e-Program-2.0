import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Divider,
  List,
  ListItemText,
  Box,
  CircularProgress,
  ListItemIcon,
  Stack,
  Paper,
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

  useEffect(() => {
    if (!user?._id) return;
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
    getSession();
  }, [user]);

  const handleDeleteSession = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d32f2f",
        cancelButtonColor: "#757575",
        confirmButtonText: "Yes, log out",
      });
      if (result.isConfirmed) {
        await axios.delete(`/auth/session/${id}`);
        setSessions((prev) => prev?.filter((s) => s.deviceId !== id) || []);
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
        return <LaptopWindowsRounded sx={{ color: "#1E88E5" }} />;
      case "Android":
        return <AndroidRounded sx={{ color: "#4CAF50" }} />;
      case "iOS":
        return <IsoRounded sx={{ color: "#E91E63" }} />;
      default:
        return <DesktopWindowsRounded sx={{ color: "#757575" }} />;
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Active Sessions
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <List>
          {sessions && sessions.length > 0 ? (
            sessions?.map((session) => (
              <Paper
                key={session.deviceId}
                elevation={3}
                sx={{ mb: 2, p: 2, borderRadius: 2 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ListItemIcon>
                      {getIconForSession(session.platform)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${session.browser} (${session.platform})`}
                      secondary={`IP: ${session.ip}`}
                    />
                  </Stack>
                  <Button
                    startIcon={<LogoutRounded />}
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeleteSession(session.deviceId)}
                  >
                    Logout
                  </Button>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", color: "gray" }}>
              No active sessions.
            </Typography>
          )}
        </List>
      )}
    </Card>
  );
};

export default Sessions;
