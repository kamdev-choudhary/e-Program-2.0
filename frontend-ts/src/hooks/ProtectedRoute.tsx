import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch } from "react-redux";

interface ProtectedRoute {
  children: ReactNode;
  requiredRole?: string;
}

// ProtectedRoute component to restrict access based on authentication and role
const ProtectedRoute: React.FC<ProtectedRoute> = ({
  children,
  requiredRole,
}) => {
  const { isLoggedIn, user } = useGlobalContext();
  const location = useLocation();
  const dispatch = useDispatch();

  // Check if user is authenticated
  if (!isLoggedIn) {
    dispatch({ type: "SET_AUTH", payload: true });
    return <Navigate to="/" state={{ from: location }} />;
  }

  // If role is required, check if the user has the correct role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to a forbidden page or handle the error
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default ProtectedRoute;
