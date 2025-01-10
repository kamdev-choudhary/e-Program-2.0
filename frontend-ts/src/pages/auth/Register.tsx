import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";

interface User {
  id: string;
  password: string;
  mobile?: string;
  email?: string;
}

interface RegisterProps {
  setActiveTab: (value: number) => void;
}

const Register: React.FC<RegisterProps> = ({ setActiveTab }) => {
  const [user, setUser] = useState<User>({
    id: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={user.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={user.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            autoComplete=""
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Login failed. Please try again.
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ mt: 1 }}>Already have an account. </Typography>
          <Button size="small" onClick={() => setActiveTab(0)}>
            Log in
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
