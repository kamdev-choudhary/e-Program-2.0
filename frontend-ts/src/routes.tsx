import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "./components/Loader";

import ProtectedRoute from "./hooks/ProtectedRoute";

// Layout Components
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
import MasterLayout from "./layout/MasterLayout";

// Test Page
const TestPage = lazy(() => import("./pages/test/Test"));

// Public Pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const NotFound = lazy(() => import("./pages/error/NotFound"));
const Unauthorized = lazy(() => import("./pages/error/Unauthorized"));
const DCI = lazy(() => import("./pages/automations/DownloadCityInformation"));
const DAC = lazy(() => import("./pages/automations/DownloadJeeMainAdmitCard"));
const JEEMainAnalysis = lazy(() => import("./pages/analysis/JEEmainAnalysis"));

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
const JEEData = lazy(() => import("./pages/admin/analysis/JEEData"));

// User Pages
const Lectures = lazy(() => import("./pages/lectures/Lectures"));
const Batches = lazy(() => import("./pages/batch/Batches"));
const BatchDetails = lazy(() => import("./pages/batch/BatchDetails"));
const Books = lazy(() => import("./pages/books/Books"));
const Profile = lazy(() => import("./pages/auth/Profile"));
const Doubts = lazy(() => import("./pages/doubts/Doubts"));
const DoubtDetails = lazy(() => import("./pages/doubts/DoubtDetails"));
const Chat = lazy(() => import("./pages/chat/Chat"));
const QuestionBank = lazy(() => import("./pages/question/QuestionBank"));

// Common Suspense Wrapper
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader />}>{<Component />}</Suspense>
);

// Route Definitions
const adminRoutes = [
  { path: "/admin/dashboard", element: withSuspense(Dashboard) },
  { path: "/admin/batch", element: withSuspense(AdminBatch) },
  { path: "/admin/academic", element: withSuspense(Academic) },
  { path: "/admin/question-bank", element: withSuspense(QuestionBankAdmin) },
  { path: "/admin/lectures", element: withSuspense(LecturesAdmin) },
  { path: "/admin/exams/online", element: withSuspense(ExamMasterOnline) },
  { path: "/admin/exams/offline", element: withSuspense(ExamMasterOffline) },
  { path: "/admin/users", element: withSuspense(UserMaster) },
  { path: "/admin/batch/edit/:id", element: withSuspense(EditBatch) },
  { path: "/admin/jee-data", element: withSuspense(JEEData) },
];

const userRoutes = [
  { path: "/batch", element: withSuspense(Batches) },
  { path: "/batch/:id", element: withSuspense(BatchDetails) },
  { path: "/books", element: withSuspense(Books) },
  { path: "/profile", element: withSuspense(Profile) },
  { path: "/doubts", element: withSuspense(Doubts) },
  { path: "/doubts/:id", element: withSuspense(DoubtDetails) },
  { path: "/chat", element: withSuspense(Chat) },
  { path: "/question-bank", element: withSuspense(QuestionBank) },
];

const publicRoutes = [
  { path: "/", element: withSuspense(HomePage) },
  { path: "/automation/jeemain/cityinfo", element: withSuspense(DCI) },
  { path: "/automation/jeemain/admitcard", element: withSuspense(DAC) },
  { path: "/analysis/jeemain", element: withSuspense(JEEMainAnalysis) },
  { path: "/lectures", element: withSuspense(Lectures) },
  { path: "/test", element: withSuspense(TestPage) },
  { path: "/unauthorized", element: withSuspense(Unauthorized) },
];

// Wrapping Admin Routes with ProtectedRoute
const protectedAdminRoutes = adminRoutes.map((route) => ({
  ...route,
  element: (
    <ProtectedRoute requiredRole={["admin"]}>{route.element}</ProtectedRoute>
  ),
}));

// Wrapping User Routes with ProtectedRoute if needed
const protectedUserRoutes = userRoutes.map((route) => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>,
}));

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/auth",
    element: withSuspense(AuthPage),
  },
  {
    element: withSuspense(MasterLayout),
    children: [
      { path: "*", element: withSuspense(NotFound) },
      ...protectedAdminRoutes,
      ...protectedUserRoutes,
      ...publicRoutes,
    ],
  },
]);

export default router;
