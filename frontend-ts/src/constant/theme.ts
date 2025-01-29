import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: { main: isLight ? "#1976d2" : "#90caf9" },
      secondary: { main: isLight ? "#dc004e" : "#03dac6" },
      background: {
        default: isLight ? "#f7f9fc" : "#121212",
        paper: isLight ? "#ffffff" : "#1d1d1d",
      },
      text: {
        primary: isLight ? "#202124" : "#ffffff",
        secondary: isLight ? "#5f6368" : "#bbb",
      },
      error: { main: "#e57373" },
    },

    shape: {
      borderRadius: 4, // Slightly rounded for a modern feel
    },

    typography: {
      fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
      fontSize: 14,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
    },

    components: {
      /** BUTTON **/
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "5px 20px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: isLight
                ? "0px 3px 6px rgba(0, 0, 0, 0.1)"
                : "0px 3px 6px rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          size: "small",
        },
      },

      MuiFormControl: {
        defaultProps: {
          size: "small",
        },
      },

      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: "4px 10px",
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            // borderRadius: 400,
          },
        },
      },

      /** APP BAR **/
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isLight ? "#fff" : "#1d1d1d",
            boxShadow: "none",
            color: isLight ? "#202124" : "#fff",
            borderBottom: `1px solid ${
              isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
            }`,
          },
        },
      },

      /** CARD **/
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isLight
              ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
              : "0px 4px 10px rgba(0, 0, 0, 0.3)",
          },
        },
      },

      /** PAPER **/
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: isLight
              ? "0px 4px 12px rgba(0, 0, 0, 0.08)"
              : "0px 4px 12px rgba(0, 0, 0, 0.3)",
            backgroundColor: isLight ? "#ffffff" : "#1d1d1d",
            padding: "16px",
            border: isLight
              ? "1px solid rgba(0, 0, 0, 0.05)"
              : "1px solid rgba(255, 255, 255, 0.05)",
          },
        },
      },

      /** TABS **/
      MuiTabs: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            minHeight: 42,
            padding: "4px",
          },
          indicator: {
            height: 3,
            borderRadius: 3,
            backgroundColor: isLight ? "#1976d2" : "#90caf9",
            transition: "all 0.3s ease-in-out",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "14px",
            padding: "10px 20px",
            borderRadius: 6,
            color: isLight ? "#555" : "#ddd",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: isLight ? "#E3EAFD" : "#444",
            },
            "&.Mui-selected": {
              color: isLight ? "#1976d2" : "#90caf9",
              backgroundColor: isLight ? "#DCE6FD" : "#555",
            },
          },
        },
      },

      /** DATA GRID **/
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${
              isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
            }`,
            backgroundColor: isLight ? "#fff" : "#2c2c2c",
            boxShadow: isLight
              ? "0px 4px 10px rgba(0, 0, 0, 0.08)"
              : "0px 4px 10px rgba(0, 0, 0, 0.3)",
          },
          columnHeader: {
            backgroundColor: isLight ? "#4F7FBF" : "#3b3b3b",
            color: "#fff",
          },
          columnHeaderTitle: {
            fontWeight: 600,
            letterSpacing: "0.5px",
          },
          row: {
            "&:nth-of-type(even)": {
              backgroundColor: isLight ? "#f6f7f8" : "#1c1c1c",
            },
            "&:hover": {
              backgroundColor: isLight ? "#e9eef5" : "#333",
              transition: "background 0.3s ease-in-out",
            },
          },
          footerContainer: {
            backgroundColor: isLight ? "#f3f3f3" : "#222222",
            opacity: 0.95,
          },
        },
      },

      /** LIST ITEMS **/
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            "&:hover": {
              backgroundColor: isLight ? "#F1FAF2" : "#333",
            },
            "&.Mui-selected": {
              backgroundColor: isLight ? "#DFF5E0" : "#444",
              color: isLight ? "#3B8F40" : "#C4E5C8",
              border: `1px solid ${isLight ? "#A5D6A7" : "#666"}`,
              "&:hover": {
                backgroundColor: isLight ? "#CDEECB" : "#555",
              },
            },
          },
        },
      },
    },
  });
};

export default getTheme;
