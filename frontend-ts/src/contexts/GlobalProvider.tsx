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
import { useNotification } from "./NotificationProvider";
import dummyImage from "../assets/user.jpg";

interface GlobalProviderProps {
  children: ReactNode;
}

interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
  photo: string;
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
  const { showNotification } = useNotification();

  const [isLoaded, setIsLoaded] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  // Initialize authentication state
  useEffect(() => {
    const initializeAuthState = () => {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      const error = localStorage.getItem("logout");
      if (error) {
        showNotification({
          message: error,
          type: "error",
          variant: "standard",
        });
        localStorage.removeItem("logout");
      }
      if (!storedToken) return setIsLoaded(true);

      try {
        const decodedToken = jwtDecode<JwtPayload & User>(storedToken);
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          showNotification({ message: "Token expired", type: "error" });
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          setIsLoaded(true);
          return;
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
        const photo = localStorage.getItem(LOCAL_STORAGE_KEYS.PHOTO);
        if (photo && photo !== "null" && photo !== "undefined") {
          setProfilePicUrl(photo);
        } else {
          setProfilePicUrl(dummyImage);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
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
      photo ? setProfilePicUrl(photo) : setProfilePicUrl(dummyImage);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER,
        JSON.stringify(decodedToken)
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.PHOTO, photo);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
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
    const deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: "",
    });
    setProfilePicUrl("");
    localStorage.clear();

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
