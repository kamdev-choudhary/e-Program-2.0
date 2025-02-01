import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      // Primary Colors
      primary: {
        main: isLight ? "#2A5CFF" : "#6C8EFF",
        contrastText: isLight ? "#F9FAFF" : "#0A0F24",
      },
      // Secondary Colors
      secondary: {
        main: isLight ? "#FF4D7A" : "#FF7D9D",
        contrastText: isLight ? "#0A0F24" : "#F9FAFF",
      },
      // Semantic Colors
      error: {
        main: isLight ? "#FF3B5B" : "#FF6B7F",
        contrastText: "#F9FAFF",
      },
      warning: {
        main: isLight ? "#FF9F0A" : "#FFB740",
        contrastText: "#0A0F24",
      },
      info: {
        main: isLight ? "#00A3FF" : "#00C7FF",
        contrastText: "#F9FAFF",
      },
      success: {
        main: isLight ? "#00C875" : "#00E18A",
        contrastText: "#0A0F24",
      },
      // Background Colors
      background: {
        default: isLight ? "#F9FAFF" : "#0A0F24",
        paper: isLight ? "#FFFFFF" : "#1A1F36",
      },
      // Text Colors
      text: {
        primary: isLight ? "#0A0F24" : "#F9FAFF",
        secondary: isLight ? "#5A6178" : "#A1A8C3",
        disabled: isLight ? "#8E95AB" : "#62687E",
      },
      // Dividers
      divider: isLight ? "rgba(10, 15, 36, 0.12)" : "rgba(249, 250, 255, 0.12)",
    },

    shape: {
      borderRadius: 6,
    },

    typography: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      fontSize: 14,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      button: {
        fontWeight: 600,
        letterSpacing: "0.03em",
      },
    },

    shadows: [
      "none",
      "0px 1px 2px rgba(10, 15, 36, 0.04)",
      "0px 2px 4px rgba(10, 15, 36, 0.08)",
      "0px 4px 8px rgba(10, 15, 36, 0.12)",
      "0px 8px 16px rgba(10, 15, 36, 0.16)",
      "0px 16px 32px rgba(10, 15, 36, 0.24)",
    ] as any,

    components: {
      MuiButton: {
        variants: [
          // Primary variant is handled in styleOverrides.contained
          // Secondary variant
          {
            props: { variant: "contained", color: "secondary" },
            style: {
              background: isLight
                ? "linear-gradient(135deg, #FF4D7A, #FF6B8F)"
                : "linear-gradient(135deg, #FF7D9D, #FF95B0)",
            },
          },
          // Success variant
          {
            props: { variant: "contained", color: "success" },
            style: {
              background: isLight
                ? "linear-gradient(135deg, #00C875, #00D68F)"
                : "linear-gradient(135deg, #00E18A, #00F5A0)",
            },
          },
          // Error variant
          {
            props: { variant: "contained", color: "error" },
            style: {
              background: isLight
                ? "linear-gradient(135deg, #FF3B5B, #FF526F)"
                : "linear-gradient(135deg, #FF6B7F, #FF8494)",
            },
          },
          // Warning variant
          {
            props: { variant: "contained", color: "warning" },
            style: {
              background: isLight
                ? "linear-gradient(135deg, #FF9F0A, #FFAF2A)"
                : "linear-gradient(135deg, #FFB740, #FFC750)",
            },
          },
          // Info variant
          {
            props: { variant: "contained", color: "info" },
            style: {
              background: isLight
                ? "linear-gradient(135deg, #00A3FF, #00B3FF)"
                : "linear-gradient(135deg, #00C7FF, #00D7FF)",
            },
          },
          // Tertiary variant (custom color)
          {
            props: { disabled: true },
            style: {
              background: isLight ? "#F0F0F0" : "#424242",
              color: isLight ? "#B0B0B0" : "#757575",
              transform: "none !important",
              boxShadow: "none !important",
              cursor: "not-allowed",
              "&:hover": {
                background: isLight ? "#F0F0F0" : "#424242",
              },
            },
          },
        ],
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 40,
            padding: "8px 24px",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "none",
            "&:hover": {
              transform: "translateY(-1px)",
              // boxShadow: isLight
              //   ? "0px 4px 12px rgba(42, 92, 255, 0.24)"
              //   : "0px 4px 12px rgba(108, 142, 255, 0.32)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          contained: {
            background: isLight
              ? "linear-gradient(135deg, #2A5CFF, #4287FF)"
              : "linear-gradient(135deg, #6C8EFF, #8AA9FF)",
          },
        },
      },

      // Add specific styles for alerts
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backdropFilter: "blur(4px)",
            fontWeight: 500,
          },
          standardSuccess: {
            background: isLight
              ? "rgba(0, 200, 117, 0.12)"
              : "rgba(0, 225, 138, 0.16)",
            border: `1px solid ${isLight ? "#00C875" : "#00E18A"}`,
          },
          standardError: {
            background: isLight
              ? "rgba(255, 59, 91, 0.12)"
              : "rgba(255, 107, 127, 0.16)",
            border: `1px solid ${isLight ? "#FF3B5B" : "#FF6B7F"}`,
          },
        },
      },

      MuiOutlinedInput: {
        defaultProps: {
          size: "small",
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            padding: 5,
          },
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
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(8px)",
            background: isLight
              ? "rgba(255, 255, 255, 01)"
              : "rgba(26, 31, 54, 0.8)",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0px 0px 0px rgba(10, 15, 36, 0.08)",
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
      MuiSelect: {
        defaultProps: {
          size: "small",
        },
      },

      MuiTextField: {
        defaultProps: {
          size: "small",
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

      // Enhanced background colors usage
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: 16,
            borderRadius: 16,
            background: isLight
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(26, 31, 54, 0.9)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${
              isLight ? "rgba(10, 15, 36, 0.08)" : "rgba(249, 250, 255, 0.08)"
            }`,
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
            background: isLight
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(26, 31, 54, 0.8)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isLight
              ? "0 4px 6px rgba(0, 100, 68, 0.08)"
              : "0 4px 10px rgba(0, 225, 138, 0.12)",

            "& .MuiDataGrid-columnHeader": {
              background: isLight
                ? "linear-gradient(0, rgba(42, 92, 255, 0.12), rgba(66, 135, 255, 0.08))"
                : "linear-gradient(0, rgba(108, 142, 255, 0.24), rgba(138, 169, 255, 0.16))",
              borderBottom: `1px solid ${
                isLight ? "rgba(10, 15, 36, 0.08)" : "rgba(249, 250, 255, 0.08)"
              }`,
            },

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
                borderLeft: `2px solid ${isLight ? "#2A5CFF" : "#6C8EFF"}`,
              },
            },

            "& .status-success": {
              background: isLight
                ? "linear-gradient(135deg, rgba(0, 200, 117, 0.12), rgba(0, 214, 143, 0.08))"
                : "linear-gradient(135deg, rgba(0, 225, 138, 0.16), rgba(0, 245, 160, 0.12))",
              color: isLight ? "#006644" : "#00E18A",
              padding: "4px 12px",
              borderRadius: 8,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              boxShadow: isLight
                ? "0 2px 4px rgba(0, 100, 68, 0.08)"
                : "0 2px 8px rgba(0, 225, 138, 0.12)",
            },

            "& .status-error": {
              background: isLight
                ? "linear-gradient(135deg, rgba(255, 59, 91, 0.12), rgba(255, 82, 111, 0.08))"
                : "linear-gradient(135deg, rgba(255, 107, 127, 0.16), rgba(255, 132, 148, 0.12))",
              color: isLight ? "#CC0025" : "#FF6B7F",
              padding: "4px 12px",
              borderRadius: 8,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              boxShadow: isLight
                ? "0 2px 4px rgba(204, 0, 37, 0.08)"
                : "0 2px 8px rgba(255, 107, 127, 0.12)",
              animation: "$pulseError 1.5s infinite",
            },

            "& .MuiDataGrid-menuIcon": {
              marginLeft: "auto",
            },
          },
        },
      },

      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
        defaultProps: { size: "small" },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  });
};

export default getTheme;
