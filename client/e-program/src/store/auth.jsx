import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userConrol, setUserControl] = useState([]);
  let isAdmin = false;
  let accountType = "student";
  let userId = "";

  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  const isLoggedIn = !!token;
  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin;
    accountType = decoded.accountType;
    userId = decoded.userId;
  }

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        accountType,
        userId,
        storeTokenInLS,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
