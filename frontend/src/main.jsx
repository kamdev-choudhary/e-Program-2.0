import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import { GlobalProvider } from "./GlobalProvider";
import App from "./App.jsx";
import "./index.css";
import { WebSocketProvider } from "./WebsocketContext";

const isDevelopment = import.meta.env.NODE_ENV === "development";

const AppWrapper = (
  <Provider store={store}>
    <GlobalProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </GlobalProvider>
  </Provider>
);

createRoot(document.getElementById("root")).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
