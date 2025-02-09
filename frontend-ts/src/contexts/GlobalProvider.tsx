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
import { LS_KEYS } from "../constant/constants";
import axios from "../hooks/AxiosInterceptor";
import { useNotification } from "./NotificationProvider";
import dummyImage from "../assets/user.jpg";
import { UserRole } from "../constant/roles";

interface GlobalProviderProps {
  children: ReactNode;
}

interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: UserRole;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  photo?: string | null;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string;
  handleUserLogin: (response: LoginResponse) => void;
  handleLogout: () => void;
  profilePicUrl: string;
  setProfilePicUrl: (value: string) => void;
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
  const [profilePicUrl, setProfilePicUrl] = useState(dummyImage);
  const { showNotification } = useNotification();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuthState = () => {
      const storedToken = localStorage.getItem(LS_KEYS.ACCESS_TOKEN);
      const logoutError = localStorage.getItem(LS_KEYS.LOGOUT);

      // Handle logout error notification
      if (logoutError) {
        showNotification({
          message: logoutError,
          type: "error",
          variant: "standard",
        });
        localStorage.removeItem(LS_KEYS.LOGOUT);
      }

      if (!storedToken) {
        setIsLoaded(true);
        return;
      }

      try {
        const decodedToken = jwtDecode<JwtPayload & User>(storedToken);
        const isTokenExpired =
          decodedToken.exp && decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
          showNotification({ message: "Token expired", type: "error" });
          localStorage.removeItem(LS_KEYS.ACCESS_TOKEN);
        } else {
          const user = {
            _id: decodedToken._id,
            name: decodedToken.name,
            role: decodedToken.role,
            email: decodedToken.email,
            mobile: decodedToken.mobile,
          };

          setAuthState({ isLoggedIn: true, user, token: storedToken });

          const storedPhoto = localStorage.getItem(LS_KEYS.PHOTO) || dummyImage;
          setProfilePicUrl(
            storedPhoto !== "null" && storedPhoto !== "undefined"
              ? storedPhoto
              : dummyImage
          );
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
      } finally {
        setIsLoaded(true);
      }
    };

    initializeAuthState();
  }, [showNotification]);

  // Handle user login
  const handleUserLogin = (data: LoginResponse) => {
    const { token, photo, refreshToken } = data;
    try {
      const decodedToken = jwtDecode<JwtPayload & User>(token);
      const user = {
        _id: decodedToken._id,
        name: decodedToken.name,
        role: decodedToken.role,
        email: decodedToken.email,
        mobile: decodedToken.mobile,
      };
      setAuthState({ isLoggedIn: true, user, token });
      setProfilePicUrl(photo || dummyImage);
      localStorage.setItem(LS_KEYS.PHOTO, photo || "");
      localStorage.setItem(LS_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(LS_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error("Invalid token:", error);
      showNotification({
        message: "Login failed. Invalid token.",
        type: "error",
        variant: "filled",
      });
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    const deviceId = localStorage.getItem(LS_KEYS.DEVICE_ID);

    setAuthState({ isLoggedIn: false, user: null, token: "" });
    setProfilePicUrl(dummyImage);
    localStorage.removeItem(LS_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LS_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LS_KEYS.PHOTO);
    try {
      if (deviceId) {
        await axios.delete(`/auth/session/${deviceId}`);
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      isLoggedIn: authState.isLoggedIn,
      user: authState.user,
      token: authState.token,
      handleUserLogin,
      handleLogout,
      setProfilePicUrl,
      profilePicUrl,
    }),
    [authState, profilePicUrl]
  );

  // Show loader while initializing
  if (!isLoaded) return <Loader />;

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
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
