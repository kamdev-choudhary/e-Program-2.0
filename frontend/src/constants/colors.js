export const lightColors = {
  primary: "#1976D2",
  secondary: "#7E57C2",
  error: "#F44336",
  success: "#388E3C",
  warning: "#FFC107",
  background: {
    default: "#F4F6F8",
    paper: "#ffffff",
    primary: "rgba(25, 118, 210, 0.1)",
    secondary: "rgba(126, 87, 194, 0.1)",
    hover: "#f0f0f0",
    gradient: "linear-gradient(to bottom right, #1976D2, #7E57C2)",
  },
  borderColors: {
    primary: "#000",
  },
};

export const darkColors = {
  primary: "#1976D2",
  secondary: "#FFAB91",
  error: "#FF5252",
  success: "#66BB6A",
  warning: "#FFCA28",
  background: {
    default: "#1C1C1C",
    paper: "#232323",
    primary: "#282828",
    secondary: "#333333",
    hover: "#424242",
    gradient: "linear-gradient(to bottom right, #1976D2, #FFAB91)",
  },
  borderColors: {
    primary: "#fff",
  },
};

// Custom color function to allow overrides
export const getCustomColors = (customColors) => ({
  primary: customColors.primary || lightColors.primary,
  secondary: customColors.secondary || lightColors.secondary,
  error: customColors.error || lightColors.error,
  success: customColors.success || lightColors.success,
  warning: customColors.warning || lightColors.warning,
  background: {
    ...lightColors.background,
    ...customColors.background,
  },
});
