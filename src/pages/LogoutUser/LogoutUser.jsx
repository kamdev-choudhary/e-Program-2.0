import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../store/auth";

const LogoutUser = () => {
  const { logoutUser } = useAuth();

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return <Navigate to="/login" />;
};

export default LogoutUser;
