// useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (url) => {
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the server
    socketRef.current = io(url);

    // Clean up connection on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [url]);

  return socketRef;
};

export default useSocket;
