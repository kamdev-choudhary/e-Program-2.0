import { lazy, Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import Loader from "./components/Loader";
import ProtectedRoute from "./hooks/ProtectedRoute";

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

// Define the route structure with types
interface RouteConfig {
  path: string;
  element: React.ComponentType;
  allowedRoles: string[];
}

const routesConfig: RouteConfig[] = [
  { path: "/", element: HomePage, allowedRoles: ["public"] },
  { path: "/admin/dashboard", element: Dashboard, allowedRoles: ["admin"] },
  { path: "/admin/batch", element: AdminBatch, allowedRoles: ["admin"] },
  { path: "/admin/academic", element: Academic, allowedRoles: ["admin"] },
  {
    path: "/admin/question-bank",
    element: QuestionBankAdmin,
    allowedRoles: ["admin"],
  },
  { path: "/admin/lectures", element: LecturesAdmin, allowedRoles: ["admin"] },
  {
    path: "/admin/exams/online",
    element: ExamMasterOnline,
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/exams/offline",
    element: ExamMasterOffline,
    allowedRoles: ["admin"],
  },
  { path: "/admin/users", element: UserMaster, allowedRoles: ["admin"] },
  {
    path: "/admin/batch/edit/:id",
    element: EditBatch,
    allowedRoles: ["admin"],
  },
  { path: "/admin/jee-data", element: JEEData, allowedRoles: ["admin"] },
  {
    path: "/automation/jeemain/cityinfo",
    element: DCI,
    allowedRoles: ["public"],
  },
  {
    path: "/automation/jeemain/admitcard",
    element: DAC,
    allowedRoles: ["public"],
  },
  {
    path: "/analysis/jeemain",
    element: JEEMainAnalysis,
    allowedRoles: ["public"],
  },
  {
    path: "/lectures",
    element: Lectures,
    allowedRoles: ["student", "admin"],
  },
  { path: "/test", element: TestPage, allowedRoles: ["public"] },
  { path: "/unauthorized", element: Unauthorized, allowedRoles: ["public"] },
  {
    path: "/batch",
    element: Batches,
    allowedRoles: ["student", "admin"],
  },
  {
    path: "/batch/:id",
    element: BatchDetails,
    allowedRoles: ["student", "admin"],
  },
  {
    path: "/books",
    element: Books,
    allowedRoles: ["student", "admin"],
  },
  { path: "/profile", element: Profile, allowedRoles: ["student", "admin"] },
  { path: "/doubts", element: Doubts, allowedRoles: ["student", "admin"] },
  {
    path: "/doubts/:id",
    element: DoubtDetails,
    allowedRoles: ["student", "admin"],
  },
  { path: "/chat", element: Chat, allowedRoles: ["student", "admin"] },
  {
    path: "/question-bank",
    element: QuestionBank,
    allowedRoles: ["student", "admin"],
  },
  {
    path: "/*",
    element: NotFound,
    allowedRoles: ["public"],
  },
];

// Simplified route mapping with ProtectedRoute
const wrapRoute = (route: RouteConfig): RouteObject => {
  return {
    path: route.path,
    element: (
      <ProtectedRoute allowedRoles={route.allowedRoles}>
        <Suspense fallback={<Loader />}>
          <route.element />
        </Suspense>
      </ProtectedRoute>
    ),
  };
};

// Router setup with typed routes
const router = createBrowserRouter([
  {
    element: <MasterLayout />,
    children: routesConfig.map(wrapRoute),
  },
]);

export default router;
