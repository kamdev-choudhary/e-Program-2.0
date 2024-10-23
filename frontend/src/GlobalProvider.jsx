import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GlobalContext.Provider value={{ token, user, isLoggedIn }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalProvider = () => {
  return useContext(GlobalContext);
};
