import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "./constant/theme.ts";
import { GlobalProvider } from "./GlobalProvider.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const isDevelopment = import.meta.env.MODE === "development";

const queryClient = new QueryClient();

const AppWrapper = (
  <GlobalProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </GlobalProvider>
);

createRoot(document.getElementById("root")!).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
