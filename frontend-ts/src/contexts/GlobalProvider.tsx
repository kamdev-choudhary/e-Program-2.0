import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Loader from "../components/Loader";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { debounce } from "lodash";
import { LOCAL_STORAGE_KEYS } from "../constant/constants";
import axios from "../hooks/AxiosInterceptor";

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
  toggleTheme: (value: string) => void;
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
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null as User | null,
    token: "",
  });
  const [theme, setTheme] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: "",
    type: "success",
    variant: "filled",
  });
  const [profilePicUrl, setProfilePicUrl] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(storedTheme || (prefersDark ? "dark" : "light"));
  }, []);

  const getProfilePic = async (id: string) => {
    try {
      const response = await axios.get(`/user/profile-pic/${id}`);
      if (isValidResponse(response)) {
        setProfilePicUrl(response.data.profilePicUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initializeAuthState = () => {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        setIsLoaded(true);
        return;
      }

      try {
        const decodedToken = jwtDecode<
          JwtPayload & {
            _id: string;
            name: string;
            role: string;
            email: string;
            mobile: string;
          }
        >(storedToken);

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
        if (decodedToken._id) {
          getProfilePic(decodedToken._id);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeAuthState();
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const handleUserLogin = (data: LoginResponse) => {
    const { token } = data;

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

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER,
        JSON.stringify(decodedToken)
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const handleLogout = () => {
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: "",
    });
    localStorage.clear();
  };

  const statusMessages: Record<
    number,
    { message: string; type: "success" | "error" | "warning" | "info" }
  > = {
    1: { message: "Record Found.", type: "success" },
    2: { message: "Record Found.", type: "success" },
    3: { message: "Updated", type: "info" },
    4: { message: "Record Found.", type: "success" },
    0: { message: "Deleted Successfully.", type: "error" },
  };

  const isValidResponse = (response: Response): boolean => {
    const { status_code } = response.data;
    const statusConfig = statusMessages[status_code];

    if (statusConfig) {
      showNotification(
        response.data.message || statusConfig.message,
        statusConfig.type
      );
      return true;
    }

    return false;
  };

  const debouncedShowNotification = debounce(
    (
      message: string,
      type: "success" | "error" | "warning" | "info",
      variant: "filled" | "outlined" | "standard"
    ) => {
      setNotification({ open: true, message, type, variant });
    },
    300
  );

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
    variant: "filled" | "outlined" | "standard" = "filled"
  ) => {
    debouncedShowNotification(message, type, variant);
  };

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const toggleTheme = (value: string) => setTheme(value);

  const contextValue = useMemo(
    () => ({
      isValidResponse,
      theme,
      toggleTheme,
      isLoggedIn: authState.isLoggedIn,
      user: authState.user,
      token: authState.token,
      handleUserLogin,
      handleLogout,
      showNotification,
      setProfilePicUrl,
      profilePicUrl,
    }),
    [isValidResponse, theme, authState, profilePicUrl]
  );

  if (!isLoaded) return <Loader />;

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={notification.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
      >
        <Alert
          severity={notification.type}
          variant={notification.variant}
          sx={{ minWidth: 300 }}
          action={
            <IconButton
              size="small"
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
