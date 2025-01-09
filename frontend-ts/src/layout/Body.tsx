import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import routes from "../pages"; // Import the route configuration
import { AppRoute } from "../pages"; // Ensure AppRoute type is properly defined
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// Mock authentication and role context (replace with actual implementation)
const isAuthenticated = (): boolean => {
  // Replace with actual authentication logic
  return Boolean(localStorage.getItem("isLoggedIn"));
};

const getUserRole = (): "admin" | "user" | "guest" => {
  // Replace with actual role-fetching logic
  return (
    (localStorage.getItem("userRole") as "admin" | "user" | "guest") || "guest"
  );
};

// Recursive function to render routes
const renderRoutes = (routes: AppRoute[]): JSX.Element[] => {
  const userRole = getUserRole();

  return routes.map((route, index) => {
    const authPage = useSelector((state: RootState) => state.authPage);
    const isAllowed =
      (!route.requiresLogin || isAuthenticated()) &&
      (!route.restrictedTo || route.restrictedTo.includes(userRole));

    return (
      <React.Fragment key={index}>
        {isAllowed ? (
          // Render the current route
          <Route path={route.path} element={<route.component />} />
        ) : (
          <Route
            path={route.path}
            element={
              <Navigate to={isAuthenticated() ? "/unauthorized" : "/login"} />
            }
          />
        )}

        {/* Render subroutes recursively, if they exist */}
        {route.subRoutes && renderRoutes(route.subRoutes)}
      </React.Fragment>
    );
  });
};

const Body: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

export default Body;
