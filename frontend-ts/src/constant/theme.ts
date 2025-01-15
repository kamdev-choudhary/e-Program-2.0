import { createTheme, ThemeOptions } from "@mui/material/styles";

const commonThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: 2, // Set default border radius
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
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 16,
        },
      },
    },
  },
};

const lightThemeOptions: ThemeOptions = {
  ...commonThemeOptions,
  palette: {
    mode: "light",
    success: {
      light: "#dff5e0", // Existing light color
      main: "#4caf50",
      dark: "#388e3c",
      extraLight: "#f4fcf7", // Add extra light tones
    },
    error: {
      light: "#fddede",
      main: "#f44336",
      dark: "#d32f2f",
      extraLight: "#fef4f4",
    },
    warning: {
      light: "#fff8d8",
      main: "#ff9800",
      dark: "#f57c00",
      extraLight: "#fffef4",
    },
    info: {
      light: "#e0f7fa",
      main: "#03a9f4",
      dark: "#0288d1",
      extraLight: "#f0fcfd",
    },
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
