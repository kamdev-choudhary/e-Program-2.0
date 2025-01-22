import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalProvider";

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

  if (allowedRoles?.includes("public")) {
    return <>{children}</>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    (!user || !user.role || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
