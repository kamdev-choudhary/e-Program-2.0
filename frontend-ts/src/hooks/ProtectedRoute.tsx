import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../contexts/GlobalProvider";
import { useDispatch } from "react-redux";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[]; // Required roles are now an array of strings
}

// ProtectedRoute component to restrict access based on authentication and role
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isLoggedIn, user } = useGlobalContext();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    dispatch({ type: "SET_AUTH", payload: true }); // Ensure this logic aligns with your app's needs
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user's role is permitted
  if (requiredRole && (!user || !requiredRole.includes(user.role))) {
    return <Navigate to="/forbidden" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
