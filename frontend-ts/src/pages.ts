import React, { lazy } from "react";
import { RouteProps } from "react-router-dom";

// Define types for roles and routes
type Role = "admin" | "user" | "guest";

type AppRoute = RouteProps & {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  restrictedTo?: Role[];
  requiresLogin?: boolean;
  icon?: React.ElementType;
};

// Icons (Example: Material-UI Icons or other icon library)
import HomeIcon from "@mui/icons-material/Home";

// Lazy loaded components
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

// Route configuration
const routes: AppRoute[] = [
  {
    path: "/",
    component: AuthPage,
    icon: HomeIcon,
  },
];

export default routes;
