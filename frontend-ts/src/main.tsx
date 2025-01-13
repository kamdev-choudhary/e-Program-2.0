import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { GlobalProvider } from "./contexts/GlobalProvider.tsx";
import { WebSocketProvider } from "./contexts/WebSocket.tsx";
import App from "./App.tsx";
import { mode } from "./config/environment.ts";

const isDevelopment = mode === "development";

const AppWrapper = (
  <GlobalProvider>
    <WebSocketProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </WebSocketProvider>
  </GlobalProvider>
);

createRoot(document.getElementById("root")!).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
