import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    surface?: string;
    soft?: string;
    muted?: string;
    contrast?: string;
    glass?: string;
  }

  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        [key: string]: any;
      };
    };
  }
}
