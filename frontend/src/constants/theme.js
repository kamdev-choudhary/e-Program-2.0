import { createTheme } from "@mui/material";
import { lightColors, darkColors, getCustomColors } from "./colors";

export const getCustomTheme = (mode = "light", customColors = {}) => {
  const themePalette = mode === "dark" ? darkColors : lightColors;
  const finalPalette =
    mode === "custom" ? getCustomColors(customColors) : themePalette;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: finalPalette.primary,
        contrastText: mode === "dark" ? "#121212" : "#ffffff",
      },
      secondary: {
        main: finalPalette.secondary,
        contrastText: mode === "dark" ? "#121212" : "#ffffff",
      },
      error: {
        main: finalPalette.error,
      },
      success: {
        main: finalPalette.success,
      },
      warning: {
        main: finalPalette.warning,
      },
      background: {
        default: finalPalette.background.default,
        paper: finalPalette.background.paper,
        primary: finalPalette.background.primary,
        secondary: finalPalette.background.secondary,
        hover: finalPalette.background.hover,
        gradient: finalPalette.background.gradient,
      },
      customColors: finalPalette.customColors,
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
            "&:hover": {
              boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#333333" : "#ffffff",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#444444" : "#f5f5f5",
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
            backgroundColor: "#1976D2",
            color: mode === "dark" ? "#121212" : "#ffffff",
          },
          columnHeaderTitle: {
            fontWeight: "bold",
          },
        },
      },
    },
  });
};
