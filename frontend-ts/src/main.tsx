import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ThemeProvider } from "@mui/material";
import { lightTheme } from "./constant/theme.ts";

const isDevelopment = import.meta.env.MODE === "development";

const AppWrapper = (
  <Provider store={store}>
    <ThemeProvider theme={lightTheme}>
      <App />;
    </ThemeProvider>
  </Provider>
);

createRoot(document.getElementById("root")!).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
