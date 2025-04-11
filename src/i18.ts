// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // Initializes the React plugin
  .init({
    resources: {
      en: {
        translation: {
          Welcome: "Welcome",
          // Add other English translations here
        },
      },
      fr: {
        translation: {
          Welcome: "Bienvenue",
        },
      },
      hn: {
        translation: {
          Welcome: "स्वागत",
        },
      },
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language if the selected one doesn't exist
    interpolation: {
      escapeValue: false, // React handles escaping, so this is false
    },
  });

export default i18n;
