import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BASE_API_URL } from "./constants/helper";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(BASE_API_URL);
    setSocket(newSocket);
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => React.useContext(WebSocketContext);
