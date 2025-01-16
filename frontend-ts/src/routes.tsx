import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "./components/Loader";

import ProtectedRoute from "./hooks/ProtectedRoute";

// Layout Components
// const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
import MasterLayout from "./layout/MasterLayout";

// Public Pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const NotFound = lazy(() => import("./pages/error/NotFound"));
const Unauthorized = lazy(() => import("./pages/error/Unauthorized"));
const DCI = lazy(() => import("./pages/automations/DownloadCityInformation"));
const DAC = lazy(() => import("./pages/automations/DownloadJeeMainAdmitCard"));

// Admin Pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const AdminBatch = lazy(() => import("./pages/admin/batch/Batch"));
const Academic = lazy(() => import("./pages/admin/academic/Academic"));
const QuestionBankAdmin = lazy(() => import("./pages/question/QuestionBank"));
const LecturesAdmin = lazy(() => import("./pages/admin/lectures/Lectures"));
const ExamMasterOnline = lazy(
  () => import("./pages/admin/exams/ExamMasterOnline")
);
const ExamMasterOffline = lazy(
  () => import("./pages/admin/exams/ExamMasterOffline")
);
const UserMaster = lazy(() => import("./pages/admin/user/UserMaster"));
const EditBatch = lazy(() => import("./pages/admin/batch/EditBatch"));

// User Pages
const Lectures = lazy(() => import("./pages/lectures/Lectures"));
const Batches = lazy(() => import("./pages/batch/Batches"));
const BatchDetails = lazy(() => import("./pages/batch/BatchDetails"));
const Books = lazy(() => import("./pages/books/Books"));
const Profile = lazy(() => import("./pages/auth/Profile"));
const Doubts = lazy(() => import("./pages/doubts/Doubts"));
const DoubtDetails = lazy(() => import("./pages/doubts/DoubtDetails"));
const Chat = lazy(() => import("./pages/chat/Chat"));

// Admin Route Definitions
const adminRoutes = [
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/batch", element: <AdminBatch /> },
  { path: "/admin/academic", element: <Academic /> },
  { path: "/admin/question-bank", element: <QuestionBankAdmin /> },
  { path: "/admin/lectures", element: <LecturesAdmin /> },
  { path: "/admin/exams/online", element: <ExamMasterOnline /> },
  { path: "/admin/exams/offline", element: <ExamMasterOffline /> },
  { path: "/admin/users", element: <UserMaster /> },
  { path: "/admin/batch/edit/:id", element: <EditBatch /> },
];

// User Route Definitions
const userRoutes = [
  { path: "/lectures", element: <Lectures /> },
  { path: "/batch", element: <Batches /> },
  { path: "/batch/:id", element: <BatchDetails /> },
  { path: "/books", element: <Books /> },
  { path: "/profile", element: <Profile /> },
  { path: "/doubts", element: <Doubts /> },
  { path: "/doubts/:id", element: <DoubtDetails /> },
  { path: "/chat", element: <Chat /> },
];

const publicRoute = [
  { path: "/", element: <HomePage /> },
  { path: "/automation/jeemain/cityinfo", element: <DCI /> },
  { path: "/automation/jeemain/admitcard", element: <DAC /> },
  { path: "/unauthorized", element: <Unauthorized /> },
];

// Wrap Admin Routes with ProtectedRoute
const protectedAdminRoutes = adminRoutes.map((route) => ({
  ...route,
  element: (
    <Suspense fallback={<Loader />}>
      <ProtectedRoute requiredRole={["admin"]}>{route.element}</ProtectedRoute>
    </Suspense>
  ),
}));

// Wrap User Routes with ProtectedRoute if needed
const protectedUserRoutes = userRoutes.map((route) => ({
  ...route,
  element: (
    <Suspense fallback={<Loader />}>
      <ProtectedRoute>{route.element}</ProtectedRoute>
    </Suspense>
  ),
}));

// Public available routes
const publicRoutes = publicRoute.map((route) => ({
  ...route,
  element: <Suspense fallback={<Loader />}>{route.element}</Suspense>,
}));

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    element: (
      <Suspense fallback={<Loader />}>
        <MasterLayout />
      </Suspense>
    ),
    children: [
      { path: "*", element: <NotFound /> },
      ...protectedAdminRoutes,
      ...protectedUserRoutes,
      ...publicRoutes,
    ],
  },
]);

export default router;
