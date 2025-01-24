import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Loader from "../components/Loader";
import { LOCAL_STORAGE_KEYS } from "../constant/constants";
import axios from "../hooks/AxiosInterceptor";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

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
  photo: string;
}

interface Response {
  status: number;
  data: {
    message?: string;
    status_code: number;
    [key: string]: any; // Allow additional properties
  };
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string;
  handleUserLogin: (response: LoginResponse) => void;
  isValidResponse: (response: Response, notification?: boolean) => boolean;
  handleLogout: () => void;
  profilePicUrl: string;
  setProfilePicUrl: (value: string) => void;
}

interface NotificationProps {
  open: boolean;
  message?: string;
  type?: "success" | "error" | "warning";
  variant: "filled" | "outlined" | "standard"; // Type for variant prop
}

// Create GlobalContext
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    isLoggedIn: boolean;
    user: User | null;
    token: string;
  }>({
    isLoggedIn: false,
    user: null,
    token: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [notification, setNotification] = useState<NotificationProps>({
    open: false,
    message: "",
    type: "success",
    variant: "standard", // Default variant is 'filled'
  });

  // Initialize authentication state
  useEffect(() => {
    const initializeAuthState = () => {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        setIsLoaded(true);
        return;
      }

      try {
        const decodedToken = jwtDecode<JwtPayload & User>(storedToken);
        setAuthState({
          isLoggedIn: true,
          user: {
            _id: decodedToken._id,
            name: decodedToken.name,
            role: decodedToken.role,
            email: decodedToken.email,
            mobile: decodedToken.mobile,
          },
          token: storedToken,
        });
        const photo = localStorage.getItem(LOCAL_STORAGE_KEYS.PHOTO);
        if (photo) setProfilePicUrl(photo);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeAuthState();
  }, []);

  // Handle user login
  const handleUserLogin = (data: LoginResponse) => {
    const { token, photo } = data;

    try {
      const decodedToken = jwtDecode<JwtPayload & User>(token);
      setAuthState({
        isLoggedIn: true,
        user: {
          _id: decodedToken._id,
          name: decodedToken.name,
          role: decodedToken.role,
          email: decodedToken.email,
          mobile: decodedToken.mobile,
        },
        token,
      });
      setProfilePicUrl(photo);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER,
        JSON.stringify(decodedToken)
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.PHOTO, photo);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    const deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);
    await axios.delete(`/auth/session/${deviceId}`);
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: "",
    });
    setProfilePicUrl("");
    localStorage.clear();
  };

  // Status messages for API responses
  const statusMessages: Record<
    number,
    { message: string; type: "success" | "error" | "info" }
  > = {
    1: { message: "Record Found.", type: "success" },
    2: { message: "Record Found.", type: "success" },
    3: { message: "Updated", type: "info" },
    4: { message: "Record Found.", type: "success" },
    0: { message: "Deleted Successfully.", type: "error" },
  };

  // Validate API responses
  const isValidResponse = (
    response: Response,
    notification?: boolean
  ): boolean => {
    const { status_code } = response.data;
    const statusConfig = statusMessages[status_code];

    if (statusConfig) {
      if (notification !== false) {
        showNotification(
          response.data.message || statusConfig.message,
          "success",
          "standard"
        );
      }
      return true;
    }

    return false;
  };

  const handleCloseAlert = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" = "success",
    variant: "filled" | "outlined" | "standard"
  ) => {
    setNotification({ open: true, message, type, variant });
  };

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      isValidResponse,
      isLoggedIn: authState.isLoggedIn,
      user: authState.user,
      token: authState.token,
      handleUserLogin,
      handleLogout,
      setProfilePicUrl,
      profilePicUrl,
    }),
    [isValidResponse, authState, profilePicUrl]
  );

  // Show loader while initializing
  if (!isLoaded) return <Loader />;

  const actions = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseAlert}
    >
      <CloseRounded />
    </IconButton>
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        action={actions}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          sx={{ minWidth: 250 }}
          severity={notification.type}
          variant={notification.variant}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </GlobalContext.Provider>
  );
};

// Custom hook to use the GlobalContext
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
