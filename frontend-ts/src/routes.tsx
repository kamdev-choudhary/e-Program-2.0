import { lazy } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute";
import withSuspense from "./hooks/WithSuspense";

import MasterLayout from "./layout/MasterLayout";

// Test Page
const TestPage = withSuspense(lazy(() => import("./pages/test/Test")));

// Public Pages
const HomePage = withSuspense(lazy(() => import("./pages/home/HomePage")));
const NotFound = withSuspense(lazy(() => import("./pages/error/NotFound")));
const Unauthorized = withSuspense(
  lazy(() => import("./pages/error/Unauthorized"))
);
const DCI = withSuspense(
  lazy(() => import("./pages/automations/DownloadCityInformation"))
);
const DAC = withSuspense(
  lazy(() => import("./pages/automations/DownloadJeeMainAdmitCard"))
);
const JEEMainAnalysis = withSuspense(
  lazy(() => import("./pages/analysis/JEEmainAnalysis"))
);

// Admin Pages
const Dashboard = withSuspense(
  lazy(() => import("./pages/dashboard/Dashboard"))
);
const AdminBatch = withSuspense(
  lazy(() => import("./pages/admin/batch/Batch"))
);
const Academic = withSuspense(
  lazy(() => import("./pages/admin/academic/Academic"))
);
const QuestionBankAdmin = withSuspense(
  lazy(() => import("./pages/question/QuestionBank"))
);
const LecturesAdmin = withSuspense(
  lazy(() => import("./pages/admin/lectures/Lectures"))
);
const ExamMasterOnline = withSuspense(
  lazy(() => import("./pages/admin/exams/ExamMasterOnline"))
);
const ExamMasterOffline = withSuspense(
  lazy(() => import("./pages/admin/exams/ExamMasterOffline"))
);
const UserMaster = withSuspense(
  lazy(() => import("./pages/admin/user/UserMaster"))
);
const EditBatch = withSuspense(
  lazy(() => import("./pages/admin/batch/EditBatch"))
);
const JEEData = withSuspense(
  lazy(() => import("./pages/admin/analysis/JEEData"))
);

// User Pages
const Lectures = withSuspense(lazy(() => import("./pages/lectures/Lectures")));
const Batches = withSuspense(lazy(() => import("./pages/batch/Batches")));
const BatchDetails = withSuspense(
  lazy(() => import("./pages/batch/BatchDetails"))
);
const Books = withSuspense(lazy(() => import("./pages/books/Books")));
const Profile = withSuspense(lazy(() => import("./pages/auth/Profile")));
const Doubts = withSuspense(lazy(() => import("./pages/doubts/Doubts")));
const DoubtDetails = withSuspense(
  lazy(() => import("./pages/doubts/DoubtDetails"))
);
const Chat = withSuspense(lazy(() => import("./pages/chat/Chat")));
const QuestionBank = withSuspense(
  lazy(() => import("./pages/question/QuestionBank"))
);
const GenerateAdmitCard = withSuspense(
  lazy(() => import("./pages/automations/GenerateAdmitCard"))
);

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
    path: "/automation/jeemaincityinfo",
    element: DCI,
    allowedRoles: ["public"],
  },
  {
    path: "/automation/jeemainadmitcard",
    element: DAC,
    allowedRoles: ["public"],
  },
  {
    path: "/automation/jdstadmitcard",
    element: GenerateAdmitCard,
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
        <route.element />
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
