import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  // Modern, globally applied color palette for primary, secondary, success, and error
  const colors = {
    primary: isLight ? "#2A5CFF" : "#6C8EFF",
    secondary: isLight ? "#E91E63" : "#FF4081",
    success: isLight ? "#00C853" : "#00E676",
    error: isLight ? "#D32F2F" : "#FF5252",
    backgroundDefault: isLight ? "#f1f3fb" : "#292a2d",
    paper: isLight ? "#FFFFFF" : "#212327",
    textPrimary: isLight ? "#0F172A" : "#F8FAFC",
    textSecondary: isLight ? "#64748B" : "#94A3B8",
  };

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      success: { main: colors.success },
      error: { main: colors.error },
      background: {
        default: colors.backgroundDefault,
        paper: colors.paper,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
    },

    shape: {
      borderRadius: 8,
    },

    typography: {
      fontFamily: [
        '"Inter Variable"',
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "Oxygen-Sans",
        "Ubuntu",
        "Cantarell",
        "sans-serif",
      ].join(","),
      fontSize: 14,
      h1: {
        fontSize: "2.5rem",
        fontWeight: 800,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
        letterSpacing: "-0.015em",
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      body1: {
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        letterSpacing: "0.02em",
      },
    },

    components: {
      // Keep the original Button settings for padding/margin and text transformation
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 30,
            paddingLeft: 24,
            paddingRight: 24,
            // For dark mode, override text color if needed.
            color: isLight ? undefined : "#F8FAFC",
          },
        },
      },

      // Preserve the original AppBar background styling
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isLight ? "rgba(255, 255, 255, 0.7)" : "#212327",
            borderColor: isLight
              ? "rgba(15, 23, 42, 0.08)"
              : "rgba(248, 250, 252, 0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            padding: 16,
            borderRadius: 12,
            boxShadow: isLight
              ? "0 4px 12px rgba(0, 0, 0, 0.08)"
              : "0 4px 12px rgba(0, 0, 0, 0.24)",
            transition: "all 0.3s ease-in-out",
            backdropFilter: "saturate(180%) blur(20px)",
            border: isLight
              ? "1px solid rgba(0, 0, 0, 0.05)"
              : "1px solid rgba(255, 255, 255, 0.1)",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary,
            },
          },
        },
        defaultProps: {
          size: "small",
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            backdropFilter: "blur(8px)",
            background: isLight
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(30, 41, 59, 0.9)",
            border: "1px solid",
            borderColor: isLight
              ? "rgba(15, 23, 42, 0.08)"
              : "rgba(248, 250, 252, 0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        },
      },

      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "1px solid rgba(150, 148, 148, 0.3)",
            borderRadius: 16,
            overflow: "hidden",
            background: isLight ? "rgb(255, 255, 255)" : "#212327",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "& .MuiDataGrid-row": {
              transition: "all 0.1s ease",
              "&:hover": {
                background: isLight
                  ? "rgba(42, 92, 255, 0.04)"
                  : "rgba(108, 142, 255, 0.08)",
              },
              "&.Mui-selected": {
                background: isLight
                  ? "rgba(42, 92, 255, 0.08)"
                  : "rgba(108, 142, 255, 0.16)",
              },
            },
            "& .status-success": {
              color: isLight ? "#006644" : "#00E18A",
            },
            "& .status-error": {
              color: isLight ? "#CC0025" : "#FF6B7F",
            },
          },
        },
      },

      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
          },
        },
        defaultProps: {
          size: "small",
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            // Set the overall border radius
            borderRadius: 80,
            // Customize the selected state
            "&.Mui-selected": {
              backgroundColor: isLight
                ? "rgba(195, 199, 255, 0.81)" // Light mode selected color
                : "rgba(108, 142, 255, 0.16)", // Dark mode selected color

              "&:hover": {
                backgroundColor: isLight
                  ? "rgba(229, 165, 239, 0.5)" // Light mode hover on selected
                  : "rgba(108, 142, 255, 0.24)", // Dark mode hover on selected
              },
            },
          },
        },
      },

      // Other components can be added or simplified as needed
    },

    transitions: {
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      duration: {
        standard: 300,
      },
    },
  });
};

export default getTheme;
