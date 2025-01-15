import { createTheme, ThemeOptions } from "@mui/material/styles";

const commonThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: 2, // Default border radius
  },
  spacing: 8, // Default spacing unit (1 unit = 8px, can be customized)
  typography: {
    fontFamily: "'Aptos', 'Roboto', 'Arial', sans-serif", // Fonts
    fontSize: 13, // Base font size
    fontWeightLight: 300, // Light font weight
    fontWeightRegular: 400, // Regular font weight
    fontWeightMedium: 500, // Medium font weight
    fontWeightBold: 700, // Bold font weight
    h1: {
      fontSize: "2.125rem", // Headline 1
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.75rem", // Headline 2
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.5rem", // Headline 3
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.25rem", // Headline 4
      fontWeight: 700,
    },
    h5: {
      fontSize: "1rem", // Headline 5
      fontWeight: 500,
    },
    h6: {
      fontSize: "0.875rem", // Headline 6
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem", // Body text 1
    },
    body2: {
      fontSize: "0.875rem", // Body text 2
    },
    button: {
      textTransform: "none", // Button text transformation
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", // Example customization
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "inherit", // Inherit text color by default
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 16,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid rgba(0, 0, 0,0.3)",
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

const lightThemeOptions: ThemeOptions = {
  ...commonThemeOptions,
  palette: {
    mode: "light", // Theme mode (light/dark)
    primary: {
      light: "#757de8",
      main: "#344CB7", // Primary color
      dark: "#002984",
      contrastText: "#ffffff", // Text color for contrast
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336", // Secondary color
      dark: "#ba000d",
      contrastText: "#ffffff",
    },
    error: {
      light: "#fddede",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#ffffff",
      extraLight: "#fef4f4", // Additional tone
    },
    warning: {
      light: "#fff8d8",
      main: "#ff9800",
      dark: "#f57c00",
      contrastText: "#000000",
      extraLight: "#fffef4",
    },
    info: {
      light: "#e0f7fa",
      main: "#03a9f4",
      dark: "#0288d1",
      contrastText: "#ffffff",
      extraLight: "#f0fcfd",
    },
    success: {
      light: "#dff5e0",
      main: "#4caf50",
      dark: "#388e3c",
      contrastText: "#ffffff",
      extraLight: "#f4fcf7",
    },
    background: {
      default: "#f5f5f5", // Default background color
      paper: "#ffffff", // Paper background color
    },
    text: {
      primary: "#000000", // Primary text color
      secondary: "#757575", // Secondary text color
      disabled: "#bdbdbd", // Disabled text color
    },
    divider: "#e0e0e0", // Divider color
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
