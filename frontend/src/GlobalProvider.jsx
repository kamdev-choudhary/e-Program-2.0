import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./components/Loader";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deviceTheme, detDeviceTheme] = useState("light");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
    variant: "",
  });

  const handleLogin = (response) => {
    if (response?.data?.status_code === 1) {
      localStorage.setItem("token", response?.data?.token);
      showNotification(response?.data?.message);
      setUser(jwtDecode(response?.data?.token));
      setIsLoggedIn(true);
      showNotification(response?.data?.message, "success");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUser(jwtDecode(token));
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

  // Handle notification close
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
        isValidResponse,
        handleLogin,
        deviceTheme,
        logoutUser,
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
          {notification.message}
        </Alert>
      </Snackbar>
      <Loader open={loading} />
    </GlobalContext.Provider>
  );
};

export const useGlobalProvider = () => {
  return useContext(GlobalContext);
};
