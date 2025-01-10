import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface GlobalProviderProps {
  children: ReactNode;
}

interface User {
  username: string;
  role: string;
  email?: string;
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
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [theme, setTheme] = useState<string>("light");

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

  // Update theme in localStorage and the DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleUserLogin = (response: LoginResponse) => {
    setIsLoggedIn(true);
    setUser(response.user);
    setToken(response.token);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const isValidResponse = (response: Response): boolean => {
    return response.status === 200;
  };

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
