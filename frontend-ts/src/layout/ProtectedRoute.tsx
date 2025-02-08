import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalProvider";
import Unauthorized from "./Unauthorized";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isLoggedIn, user } = useGlobalContext();
  const location = useLocation();
  const userRole = user?.role;

  if (allowedRoles?.includes("public")) {
    return <>{children}</>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    (!user || !userRole || !allowedRoles.includes(userRole))
  ) {
    return <Unauthorized />;
  }

  return children;
};

export default ProtectedRoute;
