import { createTheme } from "@mui/material/styles";

// Define a light theme
export const lightTheme = createTheme({
  // palette: {
  //   mode: "light",
  //   primary: { main: "rgba(40, 132, 79, 0.9)" },
  //   secondary: {
  //     main: "rgba(145, 77, 126, 0.9)",
  //   },
  //   error: { main: "rgba(189,0,1,0.9)" },
  //   success: { main: "rgba(40, 132, 79, 0.9)", contrastText: "#fff" },
  //   warning: { main: "rgba(232, 150, 15, 0.9)" },
  //   background: {
  //     bg: "#f0f3fb",
  //     paper: "#fff",
  //     primary: "rgba(40, 132, 79, 0.2)",
  //     secondary: "rgba(145, 77, 126, 0.2)",
  //     hover: "#f1f1f1",
  //     error: "rgba(255,0,0,0.2)",
  //     warning: "rgba(255,204,0,0.4)",
  //     gradient:
  //       "linear-gradient(to bottom right, rgba(145, 77, 126, 0.2), rgba(40, 132, 79, 0.2))",
  //   },
  // },
  typography: {
    fontFamily: "sans-serif,Roboto, Arial",
  },
  // shape: {
  //   borderRadius: 4,
  // },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          minWidth: 100,
          textTransform: "none",
          //boxShadow: "none",
          textTransform: "none", // No uppercase text
          padding: "8px 16px", // Custom padding
          "&:hover": {
            boxShadow: "none", // No shadow on hover
            // backgroundColor: "rgba(0, 0, 0, 0.04)", // Slight hover background color
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#7D8ABC",
          color: "#fff",
        },
        columnHeaderTitle: {
          fontWeight: "bold",
        },
      },
    },
  },
});

// Dark Theme

// Define a dark theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#28844f",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      bg: "#1d1d1d",
      paper: "#1d1d1d",
      primary: "#1d1d1d",
      secondary: "#2d2d2d",
      hover: "#414141",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 100,
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#232323",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 400,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#1d1d1d",
          color: "#fff",
        },
        columnHeaderTitle: {
          fontWeight: "bold",
        },
      },
    },
  },
});
