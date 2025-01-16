import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Loader from "../components/Loader";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface GlobalProviderProps {
  children: ReactNode;
}

interface User {
  _id: string;
  name: string;
  role: string;
  email?: string;
  mobile?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface Response {
  status: number;
  data: any;
}

interface GlobalContextType {
  theme: string;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  user: User | null;
  token: string;
  handleUserLogin: (response: LoginResponse) => void;
  isValidResponse: (response: Response) => boolean;
  handleLogout: () => void;
  showNotification: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    variant?: "filled" | "outlined" | "standard"
  ) => void;
  deviceTheme: string;
  profilePicUrl: string;
  setProfilePicUrl: (value: string) => void;
}

interface Notification {
  open: boolean;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  variant?: "filled" | "outlined" | "standard";
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [theme, setTheme] = useState<string>("light");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: "",
    type: "success",
    variant: "filled",
  });
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const deviceTheme = "light";

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setTheme(storedTheme || (prefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    const initializeAuthState = () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoaded(true);
        return;
      }

      try {
        const decodedToken = jwtDecode<
          JwtPayload & {
            name: string;
            role: string;
            email: string;
            _id: string;
          }
        >(storedToken);

        const decodedUser: User = {
          _id: decodedToken._id,
          name: decodedToken.name,
          role: decodedToken.role,
          email: decodedToken.email,
        };

        setIsLoggedIn(true);
        setToken(storedToken);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoaded(true);
      }
    };

    initializeAuthState();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleUserLogin = (data: LoginResponse) => {
    const { token } = data;

    try {
      const decodedToken = jwtDecode<
        JwtPayload & { name: string; role: string; email: string; _id: string }
      >(token);

      const decodedUser: User = {
        _id: decodedToken._id,
        name: decodedToken.name,
        role: decodedToken.role,
        email: decodedToken.email,
      };

      setIsLoggedIn(true);
      setUser(decodedUser);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const isValidResponse = (response: Response): boolean => {
    const status = response.data.status_code;
    let message = response.data.message;
    if ([1, 2, 4].includes(status)) {
      showNotification(message || "Record Found.", "success", "filled");
      return true;
    } else if ([3].includes(status)) {
      showNotification(message || "Updated", "info", "filled");
      return true;
    } else if (status === 0) {
      showNotification(message || "Deleted Succesfully.", "error");
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken("");
    localStorage.clear();
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
    variant: "filled" | "outlined" | "standard" = "outlined"
  ) => {
    setNotification({ open: true, message, type, variant });
  };

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <GlobalContext.Provider
      value={{
        isValidResponse,
        theme,
        toggleTheme,
        isLoggedIn,
        user,
        token,
        handleUserLogin,
        handleLogout,
        showNotification,
        deviceTheme,
        setProfilePicUrl,
        profilePicUrl,
      }}
    >
      {children}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={notification.open}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert
          severity={notification.type}
          variant={notification.variant}
          sx={{
            minWidth: 300,
          }}
          action={
            <IconButton
              color="inherit"
              onClick={() => setNotification({ ...notification, open: false })}
            >
              <CancelIcon />
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
