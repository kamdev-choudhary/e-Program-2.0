import { createTheme } from "@mui/material/styles";

// Define a light theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4CAF50", // Soft green
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7E57C2", // Lavender purple
      contrastText: "#ffffff",
    },
    error: {
      main: "#F44336", // Soft red
    },
    success: {
      main: "#388E3C", // Forest green
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFC107", // Amber
    },
    background: {
      default: "#F4F6F8", // Light grey background
      paper: "#ffffff",
      primary: "rgba(76, 175, 80, 0.1)", // Primary background accent
      secondary: "rgba(126, 87, 194, 0.1)", // Secondary background accent
      hover: "#f0f0f0", // Light hover shade
      gradient: "linear-gradient(to bottom right, #4CAF50, #7E57C2)", // Gradient for special elements
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 8, // Softer rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "10px 20px",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#4CAF50",
          color: "#ffffff",
        },
        columnHeaderTitle: {
          fontWeight: "bold",
        },
      },
    },
  },
});

// Define a dark theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#80CBC4", // Teal for primary accents
      contrastText: "#121212",
    },
    secondary: {
      main: "#FFAB91", // Soft orange
      contrastText: "#121212",
    },
    error: {
      main: "#FF5252", // Bright red
    },
    success: {
      main: "#66BB6A", // Light green
    },
    warning: {
      main: "#FFCA28", // Yellow accent
    },
    background: {
      default: "#1C1C1C", // Dark grey background
      paper: "#232323",
      primary: "#282828", // Darker background for accents
      secondary: "#333333", // Dark secondary background
      hover: "#424242", // Hover color
      gradient: "linear-gradient(to bottom right, #80CBC4, #FFAB91)", // Gradient
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 100,
          textTransform: "none",
          padding: "10px 20px",
          "&:hover": {
            boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333",
          "&:hover": {
            backgroundColor: "#444444",
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#80CBC4",
          color: "#121212",
        },
        columnHeaderTitle: {
          fontWeight: "bold",
        },
      },
    },
  },
});
