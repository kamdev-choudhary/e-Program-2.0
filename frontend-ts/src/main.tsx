import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "./constant/theme.ts";
import { GlobalProvider } from "./GlobalProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const isDevelopment = import.meta.env.MODE === "development";

const AppWrapper = (
  <GlobalProvider>
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />;
          </LocalizationProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </GlobalProvider>
);

createRoot(document.getElementById("root")!).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
