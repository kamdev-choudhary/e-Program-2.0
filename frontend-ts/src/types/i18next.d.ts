// src/types/i18next.d.ts
import "react-i18next";

// Extend the `react-i18next` module to type your keys
declare module "react-i18next" {
  interface DefaultResourcesType {
    translation: {
      Welcome: string;
      // Add other keys here as needed
    };
  }
}
