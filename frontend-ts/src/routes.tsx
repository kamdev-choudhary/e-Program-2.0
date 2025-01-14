import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "./components/Loader";

import ProtectedRoute from "./hooks/ProtectedRoute";

// Lazy Loading Helper
const lazyLoad = (path: string) => lazy(() => import(`${path}`));

// Layout Components
const DefaultLayout = lazyLoad("./layout/DefaultLayout");
const AuthPage = lazyLoad("./pages/auth/AuthPage");

// Public Pages
const HomePage = lazyLoad("./pages/home/HomePage");
const NotFound = lazyLoad("./pages/error/NotFound");
const Unauthorized = lazyLoad("./pages/error/Unauthorized");

// Admin Pages
const Dashboard = lazyLoad("./pages/dashboard/Dashboard");
const AdminBatch = lazyLoad("./pages/admin/batch/Batch");
const Academic = lazyLoad("./pages/admin/academic/Academic");
const QuestionBankAdmin = lazyLoad("./pages/question/QuestionBank");
const LecturesAdmin = lazyLoad("./pages/admin/lectures/Lectures");
const ExamMasterOnline = lazyLoad("./pages/admin/exams/ExamMasterOnline");
const ExamMasterOffline = lazyLoad("./pages/admin/exams/ExamMasterOffline");
const UserMaster = lazyLoad("./pages/admin/user/UserMaster");

// User Pages
const Lectures = lazyLoad("./pages/lectures/Lectures");
const Batches = lazyLoad("./pages/batch/Batches");
const BatchDetails = lazyLoad("./pages/batch/BatchDetails");
const Books = lazyLoad("./pages/books/Books");
const Profile = lazyLoad("./pages/auth/Profile");
const Doubts = lazyLoad("./pages/doubts/Doubts");
const DoubtDetails = lazyLoad("./pages/doubts/DoubtDetails");
const DCI = lazyLoad("./pages/automations/DownloadCityInformation");
const DAC = lazyLoad("./pages/automations/DownloadJeeMainAdmitCard");

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
    <ProtectedRoute requiredRole={["admin"]}>{route.element}</ProtectedRoute>
  ),
}));

// Wrap User Routes with ProtectedRoute if needed
const protectedUserRoutes = userRoutes.map((route) => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>,
}));

// Public available routes
const publicRoutes = publicRoute.map((route) => ({
  ...route,
  element: route.element,
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
        <DefaultLayout />
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
