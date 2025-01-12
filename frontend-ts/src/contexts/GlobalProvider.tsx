import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Loader from "../components/Loader";

interface GlobalProviderProps {
  children: ReactNode;
}

interface User {
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

// Define types for the context
interface GlobalContextType {
  theme: string;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  user: User | null;
  token: string;
  handleUserLogin: (response: LoginResponse) => void;
  isValidResponse: (response: Response) => boolean;
  handleLogout: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [theme, setTheme] = useState<string>("light");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Fetch and set the theme based on device preference or localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const initializeAuthState = () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          console.log("No token found in localStorage.");
          return;
        }

        try {
          // Decode the JWT token
          const decodedToken = jwtDecode<
            JwtPayload & { name: string; role: string; email: string }
          >(storedToken);

          if (
            !decodedToken ||
            !decodedToken.name ||
            !decodedToken.role ||
            !decodedToken.email
          ) {
            console.warn("Decoded token does not have all required fields.");
            return;
          }

          const decodedUser: User = {
            name: decodedToken.name,
            role: decodedToken.role,
            email: decodedToken.email,
          };

          // Update state
          setIsLoggedIn(true);
          setToken(storedToken);
          setUser(decodedUser);
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
          // Optionally: Clear invalid token from localStorage
          localStorage.removeItem("token");
        }
      } catch (storageError) {
        console.error("Error accessing localStorage:", storageError);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeAuthState();
  }, []);

  // Update theme in localStorage and the DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleUserLogin = (data: LoginResponse) => {
    const { token } = data;
    let decodedUser: User | null = null;

    try {
      // Decode the JWT token
      const decodedToken = jwtDecode<
        JwtPayload & { name: string; role: string; email: string }
      >(token);
      if (decodedToken) {
        decodedUser = {
          name: decodedToken.name,
          role: decodedToken.role,
          email: decodedToken.email,
        };
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    if (decodedUser) {
      setIsLoggedIn(true);
      setUser(decodedUser);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      localStorage.setItem("token", token);
    } else {
      console.error("Invalid token: Unable to set user.");
    }
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const isValidResponse = (response: Response): boolean => {
    return response.status === 200;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken("");
    localStorage.clear();
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
