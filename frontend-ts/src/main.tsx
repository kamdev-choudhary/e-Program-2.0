import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { GlobalProvider } from "./contexts/GlobalProvider.tsx";
import Loader from "./components/Loader.tsx";
import { WebSocketProvider } from "./contexts/WebSocket.tsx";
import App from "./App.tsx";

const isDevelopment = import.meta.env.MODE === "development";

const AppWrapper = (
  <Suspense fallback={<Loader />}>
    <GlobalProvider>
      <WebSocketProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </WebSocketProvider>
    </GlobalProvider>
  </Suspense>
);

createRoot(document.getElementById("root")!).render(
  isDevelopment ? <StrictMode>{AppWrapper}</StrictMode> : AppWrapper
);
