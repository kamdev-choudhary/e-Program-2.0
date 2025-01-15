import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    extraLight?: string;
  }

  interface SimplePaletteColorOptions {
    extraLight?: string;
  }

  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        [key: string]: any;
      };
    };
  }
}
