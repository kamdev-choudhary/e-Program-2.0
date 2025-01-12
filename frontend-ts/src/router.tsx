import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./hooks/ProtectedRoute";

// Page Components
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const NotFound = lazy(() => import("./pages/404/NotFound"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const Lectures = lazy(() => import("./pages/lectures/Lectures"));
const DCI = lazy(() => import("./pages/automations/DownloadCityInformation"));
const DAC = lazy(() => import("./pages/automations/DownloadJeeMainAdmitCard"));
const Books = lazy(() => import("./pages/books/Books"));
const Profile = lazy(() => import("./pages/auth/Profile"));
const AdminBatch = lazy(() => import("./pages/admin/batch/Batch"));
const Academic = lazy(() => import("./pages/admin/academic/Academic"));

// Define Routes
const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "*", element: <NotFound /> },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/batch",
        element: (
          <ProtectedRoute>
            <AdminBatch />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/academic",
        element: (
          <ProtectedRoute>
            <Academic />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lectures",
        element: <Lectures />,
      },
      {
        path: "/automation/jeemain/cityinfo",
        element: <DCI />,
      },
      {
        path: "/automation/jeemain/admitcard",
        element: <DAC />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default router;
