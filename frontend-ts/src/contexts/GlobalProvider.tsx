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
import toastService from "../utils/toastService";

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
  data: {
    message?: string;
    status_code: number;
    [key: string]: any; // Allow additional properties
  };
}

interface GlobalContextType {
  theme: "light" | "dark";
  toggleTheme: (value: "light" | "dark") => void;
  isLoggedIn: boolean;
  user: User | null;
  token: string;
  handleUserLogin: (response: LoginResponse) => void;
  isValidResponse: (response: Response) => boolean;
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoaded, setIsLoaded] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  // Load theme preference
  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (storedTheme) {
      setTheme(storedTheme as "light" | "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, initialTheme);
    }
  }, []);

  // Fetch user profile picture
  const getProfilePic = async (id: string) => {
    try {
      const response = await axios.get(`/user/profile-pic/${id}`);
      if (isValidResponse(response, false)) {
        setProfilePicUrl(response.data.profilePicUrl);
      }
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
    }
  };

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

  // Handle user login
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

  // Handle user logout
  const handleLogout = () => {
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: "",
    });
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
        toastService({
          message: response.data.message || statusConfig.message,
          type: statusConfig.type,
        });
      }
      return true;
    }

    return false;
  };

  // Toggle theme
  const toggleTheme = (value: "light" | "dark") => {
    setTheme(value);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, value);
  };

  // Memoize context value
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
      setProfilePicUrl,
      profilePicUrl,
    }),
    [isValidResponse, theme, authState, profilePicUrl]
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
