import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    extraLight?: string;
    light?: string;
    dark?: string;
    surface?: string;
  }

  interface SimplePaletteColorOptions {
    extraLight?: string;
    light?: string;
    dark?: string;
    surface?: string;
  }

  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        [key: string]: any;
      };
    };
  }
}
