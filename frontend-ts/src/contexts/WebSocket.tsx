import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../config/environment";

interface WebSocketContextType {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      transports: ["websocket"], // Ensure WebSocket is prioritized
      reconnection: true, // Enable automatic reconnection
      reconnectionAttempts: 5, // Limit reconnection attempts
      reconnectionDelay: 1000, // Delay between reconnection attempts
    });

    setSocket(newSocket);

    // Add event listeners
    newSocket.on("connect", () => {
      console.log("WebSocket Connected");
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket Disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket Connection Error:", error);
    });

    // Cleanup on unmount
    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
