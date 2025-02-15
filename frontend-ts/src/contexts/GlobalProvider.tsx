import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
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

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null as User | null,
    token: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(dummyImage);
  const { showNotification } = useNotification();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem(LS_KEYS.REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token available");

      const { data } = await axios.post("/auth/token/refresh", null, {
        headers: { "x-refresh-token": refreshToken },
      });
      const token = data.accessToken;
      localStorage.setItem(LS_KEYS.ACCESS_TOKEN, token);
      return token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      handleLogout();
    }
  };

  const initializeAuthState = useCallback(async () => {
    const storedToken = localStorage.getItem(LS_KEYS.ACCESS_TOKEN);
    const logoutError = localStorage.getItem(LS_KEYS.LOGOUT);

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
      let decodedToken = jwtDecode<JwtPayload & User>(storedToken);
      const isTokenExpired =
        decodedToken.exp && decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        const newToken = await refreshAccessToken();
        if (!newToken) return;
        decodedToken = jwtDecode<JwtPayload & User>(newToken);
      }

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
      setProfilePicUrl(localStorage.getItem(LS_KEYS.PHOTO) || dummyImage);
    } catch (error) {
      console.error("Invalid token:", error);
      handleLogout();
    } finally {
      setIsLoaded(true);
    }
  }, [showNotification]);

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);

  const handleUserLogin = useCallback(
    (data: LoginResponse) => {
      const { token, photo, refreshToken } = data;
      try {
        const decodedToken = jwtDecode<JwtPayload & User>(token);
        setAuthState({
          isLoggedIn: true,
          user: decodedToken,
          token,
        });
        setProfilePicUrl(photo || dummyImage);
        localStorage.setItem(LS_KEYS.ACCESS_TOKEN, token);
        localStorage.setItem(LS_KEYS.REFRESH_TOKEN, refreshToken);
        if (photo) localStorage.setItem(LS_KEYS.PHOTO, photo);
      } catch (error) {
        console.error("Invalid token:", error);
        showNotification({
          message: "Login failed. Invalid token.",
          type: "error",
          variant: "filled",
        });
      }
    },
    [showNotification]
  );

  const handleLogout = useCallback(async () => {
    setAuthState({ isLoggedIn: false, user: null, token: "" });
    setProfilePicUrl(dummyImage);
    localStorage.removeItem(LS_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LS_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LS_KEYS.PHOTO);

    const deviceId = localStorage.getItem(LS_KEYS.DEVICE_ID);
    if (!deviceId) return;

    try {
      await axios.delete(`/auth/session/${deviceId}`);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      ...authState,
      handleUserLogin,
      handleLogout,
      setProfilePicUrl,
      profilePicUrl,
    }),
    [authState, profilePicUrl, handleUserLogin, handleLogout]
  );

  if (!isLoaded) return <Loader />;

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
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
