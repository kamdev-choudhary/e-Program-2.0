import { createTheme, ThemeOptions } from "@mui/material/styles";

const commonThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: 4, // Standardized border radius
  },
  spacing: 8, // Default spacing unit (1 unit = 8px)
  typography: {
    fontFamily: "'Aptos', 'Roboto', 'Arial', sans-serif",
    fontSize: 13, // Base font size
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
          padding: "8px 16px", // Standard padding for buttons
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f1f3fb", // Default app bar color for light theme
        },
      },
    },
  },
};

// Light theme-specific options
const lightThemeOptions: ThemeOptions = {
  ...commonThemeOptions,
  palette: {
    mode: "light",
    background: {
      default: "#f1f3fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#000",
      secondary: "#555",
    },
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid rgba(0, 0, 0, 0.12)",
        },
        columnHeader: {
          backgroundColor: "#608BC1",
          color: "#fff",
        },
        columnHeaderTitle: {
          fontWeight: "bold",
        },
        row: {
          "&:nth-of-type(even)": {
            backgroundColor: "#f9f9f9", // Zebra striping for rows
          },
        },
        footerContainer: {
          backgroundColor: "#f3f3f3",
        },
      },
    },
  },
};

// Dark theme-specific options
const darkThemeOptions: ThemeOptions = {
  ...commonThemeOptions,
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#fff",
      secondary: "#bbb",
    },
    primary: {
      main: "#bb86fc",
    },
    secondary: {
      main: "#03dac6",
    },
    error: {
      main: "#cf6679",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d1d1d", // Dark app bar color
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid rgba(255, 255, 255, 0.12)",
        },
        columnHeader: {
          backgroundColor: "#3b3b3b",
          color: "#fff",
        },
        columnHeaderTitle: {
          fontWeight: "bold",
        },
        row: {
          "&:nth-of-type(even)": {
            backgroundColor: "#1c1c1c", // Zebra striping for dark theme rows
          },
        },
        footerContainer: {
          backgroundColor: "#222222",
        },
      },
    },
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
