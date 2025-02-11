import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import getTheme from "../constant/theme";

const LS_THEME_KEY = "theme"; // Local Storage Key

type ThemeMode = "light" | "dark";
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

// Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem(LS_THEME_KEY);
    return storedTheme === "dark" ? "dark" : "light"; // Default to light
  });

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(LS_THEME_KEY, newTheme);
  };

  const appTheme = useMemo(() => getTheme(theme), [theme]);

  console.log(appTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline /> {/* Ensures dark mode applies properly */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme Context
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProviderComponent");
  }
  return context;
};
