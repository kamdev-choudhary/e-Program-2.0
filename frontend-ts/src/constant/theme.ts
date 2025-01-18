import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: { main: isLight ? "#1976d2" : "#90caf9" },
      secondary: { main: isLight ? "#dc004e" : "#03dac6" },
      background: {
        default: isLight ? "#f1f3fb" : "#121212",
        paper: isLight ? "#ffffff" : "#1d1d1d",
      },
      text: {
        primary: isLight ? "#000" : "#fff",
        secondary: isLight ? "#555" : "#bbb",
      },
      ...(isLight
        ? {}
        : {
            error: { main: "#cf6679" },
          }),
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
    typography: {
      fontFamily: "'Roboto', 'Arial', sans-serif",
      fontSize: 13,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 4,
            padding: "8px 16px",
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
            backgroundColor: isLight ? "#f1f3fb" : "#1d1d1d",
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${
              isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)"
            }`,
          },
          columnHeader: {
            backgroundColor: isLight ? "#608BC1" : "#3b3b3b",
            color: "#fff",
          },
          columnHeaderTitle: {
            fontWeight: "bold",
          },
          row: {
            "&:nth-of-type(even)": {
              backgroundColor: isLight ? "#f9f9f9" : "#1c1c1c",
            },
          },
          footerContainer: {
            backgroundColor: isLight ? "#f3f3f3" : "#222222",
          },
        },
      },
    },
  });
};

export default getTheme;
