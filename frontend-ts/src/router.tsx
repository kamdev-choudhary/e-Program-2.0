import { lazy, Suspense } from "react";
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
const BatchDetails = lazy(() => import("./pages/batch/BatchDetails"));
const Batches = lazy(() => import("./pages/batch/Batches"));
const QuestionBankAdmin = lazy(() => import("./pages/question/QuestionBank"));
const LecturesAdmin = lazy(() => import("./pages/admin/lectures/Lectures"));
const ExamMasterOnline = lazy(
  () => import("./pages/admin/exams/ExamMasterOnline")
);
const ExamMasterOffline = lazy(
  () => import("./pages/admin/exams/ExamMasterOffline")
);
const Doubts = lazy(() => import("./pages/doubts/Doubts"));
const DoubtDetails = lazy(() => import("./pages/doubts/DoubtDetails"));

// Define Routes
const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DefaultLayout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "*", element: <NotFound /> },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/batch",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminBatch />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/academic",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <Academic />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/question-bank",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <QuestionBankAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/lectures",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <LecturesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/exams/online",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <ExamMasterOnline />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/exams/offline",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <ExamMasterOffline />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lectures",
        element: (
          <ProtectedRoute>
            <Lectures />
          </ProtectedRoute>
        ),
      },
      {
        path: "/batch",
        element: <Batches />,
      },
      {
        path: "/batch/:id",
        element: <BatchDetails />,
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
      {
        path: "/automation/jeemain/cityinfo",
        element: <DCI />,
      },
      {
        path: "/automation/jeemain/admitcard",
        element: <DAC />,
      },
      {
        path: "/doubts",
        element: <Doubts />,
      },
      {
        path: "/doubts/:id",
        element: <DoubtDetails />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AuthPage />
      </Suspense>
    ),
  },
]);

export default router;
