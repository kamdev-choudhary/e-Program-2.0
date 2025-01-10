import { createTheme, ThemeOptions } from "@mui/material/styles";

// Common properties for both light and dark themes
const commonThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: 8, // Set default border radius
  },
  typography: {
    fontFamily: "'Aptos', 'Roboto', 'Arial', sans-serif",
    fontSize: 13, // Default font size
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevent buttons from having uppercase text
          fontSize: "1rem",
          borderRadius: 100,
          padding: "5px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly rounded corners for a modern look
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for modern elevation
          padding: 16, // Standardized padding for better content spacing
        },
      },
    },
  },
};

// Define light theme options with academic-friendly colors
const lightThemeOptions: ThemeOptions = {
  ...commonThemeOptions,
  palette: {
    mode: "light",
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
