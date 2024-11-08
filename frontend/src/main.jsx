import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import { GlobalProvider } from "./GlobalProvider";
import App from "./App.jsx";
import "./index.css";
import { WebSocketProvider } from "./WebsocketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalProvider>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </GlobalProvider>
    </Provider>
  </StrictMode>
);
