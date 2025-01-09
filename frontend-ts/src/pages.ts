import React, { lazy } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";

import { RouteProps } from "react-router-dom";

export type AppRoute = RouteProps & {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  restrictedTo?: Role[];
  requiresLogin?: boolean;
  icon?: React.ElementType;
  subRoutes?: AppRoute[]; // Allow nesting of subroutes
};

// Pages (lazy-loaded components)
const HomePage = lazy(() => import("./pages/home/HomePage"));
const SettingsPage = lazy(() => import("./pages/settings/Settings"));
const ProfilePage = lazy(() => import("./pages/auth/Profile"));
const NotFound = lazy(() => import("./pages/404/NotFound"));

type Role = "admin" | "user" | "guest";

const routes: AppRoute[] = [
  {
    path: "/",
    component: HomePage,
    icon: HomeIcon,
    requiresLogin: false,
  },
  {
    path: "/settings",
    component: SettingsPage,
    icon: SettingsIcon,
    requiresLogin: true,
    restrictedTo: ["admin", "user"],
    subRoutes: [
      {
        path: "/settings/profile",
        component: ProfilePage,
        requiresLogin: true,
      },
    ],
  },
  {
    path: "/*",
    component: NotFound,
    icon: HomeIcon,
    requiresLogin: false,
  },
];

export default routes;
