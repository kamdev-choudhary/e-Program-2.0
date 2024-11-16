import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Remove the destructuring from jwtDecode import
import { useSelector } from "react-redux";
import Loader from "./components/Loader";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const loading = useSelector((state) => state.loading);
  const [user, setUser] = useState(null); // Initialize as null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [deviceTheme, setDeviceTheme] = useState("light");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
    variant: "",
  });

  const toggleTheme = () => {
    setDeviceTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogin = (response) => {
    const token = response?.data?.token;
    const photo = response?.data?.photo;
    if (token) {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("photo", photo);
        setPhoto(photo);
        setUser(jwtDecode(token));
        setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const photo = localStorage.getItem("photo");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser) {
          setUser(decodedUser);
          setPhoto(photo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        setIsLoggedIn(false); // Ensure user is logged out if the token is invalid
      }
    }
  }, []);

  const isValidResponse = (response) => {
    const statusCode = response?.data?.status_code;
    const message = response.data?.message;

    if ([1, 2, 3, 4, "1", "2", "3", "4"].includes(statusCode)) {
      showNotification(message, "success");
      return true;
    }
    if ([0, 5, "0", "5"].includes(statusCode)) {
      showNotification(message, "error");
      return false;
    }
    if (statusCode == 401) {
      logoutUser();
      showNotification(message, "error");
      return false;
    }
    return false;
  };

  const showNotification = (message, type = "success", variant) => {
    setNotification({ open: true, message, type, variant });
  };

  const handleClose = (event, reason) => {
    if (reason === "timeout" || reason === "clickaway") {
      setNotification((prev) => ({ ...prev, open: false }));
    }
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.clear();
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        isLoggedIn,
        deviceTheme,
        photo,
        isValidResponse,
        handleLogin,
        logoutUser,
        toggleTheme,
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={notification.open}
        onClose={handleClose}
        autoHideDuration={2000}
      >
        <Alert
          severity={notification.type}
          sx={{ width: "100%" }}
          variant={notification.variant}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
      <Loader open={loading} />
    </GlobalContext.Provider>
  );
};

export const useGlobalProvider = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalProvider must be used within a GlobalProvider");
  }
  return context;
};
