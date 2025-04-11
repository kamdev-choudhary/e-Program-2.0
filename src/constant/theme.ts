import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
    },

    shape: {
      borderRadius: 3,
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
            boxShadow: "0 2px 2px rgba(0,0,0,0.1)",
            borderBottom: "1px solid rgba(0,0,0,0.2)",
          },
        },
      },

      MuiPaper: {
        defaultProps: { elevation: 3 },
        styleOverrides: {
          root: {
            padding: 16,
            borderRadius: 12,
            transition: "all 0.3s ease-in-out",
            backdropFilter: "saturate(180%) blur(20px)",
          },
        },
      },

      MuiOutlinedInput: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
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

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },

      // Add chip styling
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 40,
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

      // Tabs
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

      // Tabs
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
      // Other components can be added or simplified as needed
    },
  });
};

export default getTheme;
