import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { GlobalProvider } from "./contexts/GlobalProvider.tsx";
import { WebSocketProvider } from "./contexts/WebSocket.tsx";
import App from "./App.tsx";
import { NotificationProvider } from "./contexts/NotificationProvider.tsx";
import { ThemeProviderComponent } from "./contexts/ThemeContext.tsx";

const isDevelopment = import.meta.env.MODE === "development";

const AppWrapper = (
  <NotificationProvider>
    <GlobalProvider>
      <WebSocketProvider>
        <Provider store={store}>
          <ThemeProviderComponent>
            <App />
          </ThemeProviderComponent>
        </Provider>
      </WebSocketProvider>
    </GlobalProvider>
  </NotificationProvider>
);

createRoot(document.getElementById("root")!).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
