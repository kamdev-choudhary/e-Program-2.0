import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";
  const primaryHue = isLight ? 230 : 210;
  const secondaryHue = isLight ? 340 : 330;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: `hsl(${primaryHue}, 80%, 55%)`,
        light: `hsl(${primaryHue}, 90%, 70%)`,
        dark: `hsl(${primaryHue}, 70%, 40%)`,
        contrastText: isLight ? "#F8FAFC" : "#0F172A",
      },
      secondary: {
        main: `hsl(${secondaryHue}, 80%, 55%)`,
        light: `hsl(${secondaryHue}, 90%, 70%)`,
        dark: `hsl(${secondaryHue}, 70%, 40%)`,
        contrastText: "#F8FAFC",
      },
      error: {
        main: `hsl(0, 80%, 55%)`,
        contrastText: "#F8FAFC",
      },
      warning: {
        main: `hsl(30, 90%, 55%)`,
        contrastText: "#0F172A",
      },
      info: {
        main: `hsl(200, 90%, 55%)`,
        contrastText: "#F8FAFC",
      },
      success: {
        main: `hsl(150, 80%, 40%)`,
        contrastText: "#F8FAFC",
      },
      background: {
        default: isLight ? "#F8FAFC" : "#292a2d",
        paper: isLight ? "#FFFFFF" : "#212327",
        surface: isLight
          ? "rgba(15, 23, 42, 0.08)"
          : "rgba(248, 250, 252, 0.08)",
      },
      text: {
        primary: isLight ? "#0F172A" : "#F8FAFC",
        secondary: isLight ? "#64748B" : "#94A3B8",
        disabled: isLight ? "#CBD5E1" : "#475569",
      },
      divider: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(248, 250, 252, 0.08)",
    },

    shape: {
      borderRadius: 5,
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

    shadows: [
      "none",
      "0 1px 2px 0 rgba(0,0,0,0.05)",
      "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
      "0 30px 60px -15px rgba(0, 0, 0, 0.2)",
      "0 35px 70px -20px rgba(0, 0, 0, 0.25)",
    ] as any,

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 30,
            paddingLeft: 24,
            paddingRight: 24,
            color: isLight ? "" : "#F8FAFC",
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backdropFilter: "blur(4px)",
            border: "1px solid",
          },
          standardSuccess: {
            background: `hsla(150, 80%, 40%, 0.12)`,
            borderColor: `hsla(150, 80%, 40%, 0.24)`,
          },
          standardError: {
            background: `hsla(0, 80%, 55%, 0.12)`,
            borderColor: `hsla(0, 80%, 55%, 0.24)`,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            background: isLight ? "rgba(255, 255, 255, 0.8)" : "#212327",
            backdropFilter: "blur(12px)",
            border: "1px solid",
            borderColor: isLight
              ? "rgba(15, 23, 42, 0.08)"
              : "rgba(248, 250, 252, 0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
            padding: 14,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isLight ? "rgba(255, 255, 255, 0.7)" : "#212327",
            borderBottom: "1px solid",
            borderColor: isLight
              ? "rgba(15, 23, 42, 0.08)"
              : "rgba(248, 250, 252, 0.08)",
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: `hsl(${primaryHue}, 80%, 55%)`,
            },
          },
        },
        defaultProps: {
          size: "small",
        },
      },

      // Add chip styling
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          colorSuccess: {
            background: isLight
              ? "rgba(0, 200, 117, 0.12)"
              : "rgba(0, 225, 138, 0.16)",
            color: isLight ? "#006644" : "#00E18A",
          },
          colorError: {
            background: isLight
              ? "rgba(255, 59, 91, 0.12)"
              : "rgba(255, 107, 127, 0.16)",
            color: isLight ? "#CC0025" : "#FF6B7F",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            background: isLight
              ? "rgba(10, 15, 36, 0.04)"
              : "rgba(249, 250, 255, 0.04)",
            padding: 8,
          },
          indicator: {
            height: "100%",
            borderRadius: 32,
            background: isLight
              ? "rgba(42, 92, 255, 0.12)"
              : "rgba(108, 142, 255, 0.24)",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            zIndex: 1,
            textTransform: "none",
            fontWeight: 600,
            padding: "1px 24px",
            borderRadius: 32,
            transition: "all 0.2s",
            "&.Mui-selected": {
              color: isLight ? "#2A5CFF" : "#6C8EFF",
            },
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: {
            background: `hsl(${primaryHue}, 80%, 90%)`,
            color: `hsl(${primaryHue}, 80%, 40%)`,
          },
        },
      },

      MuiSelect: {
        defaultProps: {
          size: "small",
        },
      },

      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: isLight ? "#CBD5E1" : "#475569",
          },
          track: {
            backgroundColor: isLight ? "#E2E8F0" : "#334155",
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight
              ? "rgba(15, 23, 42, 0.08)"
              : "rgba(248, 250, 252, 0.08)",
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            marginTop: 8,
            minWidth: 200,
          },
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

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },

      MuiToggleButton: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            borderRadius: 30,
            padding: "8px 16px",

            border: isLight
              ? "1px solid rgba(0, 0, 0, 0.45)"
              : "1px solid rgba(255, 255, 255, 0.77)",
          },
        },
      },

      // Add status colors to data grid
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "1px solid rgab(0,0,0,0.3)",
            borderRadius: 16,
            overflow: "hidden",
            background: isLight ? "rgba(255, 255, 255, 0.8)" : "#212327",
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
    },

    transitions: {
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });
};

export default getTheme;
