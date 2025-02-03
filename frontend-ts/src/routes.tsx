import { lazy, ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute";
import MasterLayout from "./layout/MasterLayout";
import withSuspense from "./hooks/WithSuspense";

// Public Pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const NotFound = lazy(() => import("./pages/error/NotFound"));
const Unauthorized = lazy(() => import("./pages/error/Unauthorized"));

// Automation & Analysis
const JEEMainCityInfo = lazy(
  () => import("./pages/automations/JEEMainCityInformation")
);
const JEEMainAdmitCard = lazy(
  () => import("./pages/automations/JeeMainAdmitCard")
);
const GenerateAdmitCard = lazy(
  () => import("./pages/automations/GenerateAdmitCard")
);
const JEEMainAnalysis = lazy(() => import("./pages/analysis/JEEmainAnalysis"));
const JeeMainProvisionalKey = lazy(
  () => import("./pages/automations/JeeMainProvisionalKey")
);
const JEEAdvancedAnalysis = lazy(
  () => import("./pages/analysis/JEEAdvancedAnalysis")
);

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

// User Pages (Scholars, Moderators, Admins)
const Lectures = lazy(() => import("./pages/lectures/Lectures"));
const Batches = lazy(() => import("./pages/batch/Batches"));
const BatchDetails = lazy(() => import("./pages/batch/BatchDetails"));
const Books = lazy(() => import("./pages/books/Books"));
const Profile = lazy(() => import("./pages/auth/Profile"));
const Doubts = lazy(() => import("./pages/doubts/Doubts"));
const DoubtDetails = lazy(() => import("./pages/doubts/DoubtDetails"));
const Chat = lazy(() => import("./pages/chat/Chat"));
const QuestionBank = lazy(() => import("./pages/question/QuestionBank"));

const SwaggerDocs = lazy(() => import("./pages/api-docs/SwaggerDocs"));

interface RoutesProps {
  path: string;
  element: ReactNode;
  roles: string[];
}

const routes: RoutesProps[] = [
  // Public Routes
  { path: "/", element: withSuspense(HomePage), roles: ["public"] },
  {
    path: "/unauthorized",
    element: withSuspense(Unauthorized),
    roles: ["public"],
  },
  {
    path: "/automation/jeemaincityinfo",
    element: withSuspense(JEEMainCityInfo),
    roles: ["public"],
  },
  {
    path: "/automation/jeemainadmitcard",
    element: withSuspense(JEEMainAdmitCard),
    roles: ["public"],
  },
  {
    path: "/automation/jdstadmitcard",
    element: withSuspense(GenerateAdmitCard),
    roles: ["public"],
  },
  {
    path: "/automation/jeemainprovisionalanswerkey",
    element: withSuspense(JeeMainProvisionalKey),
    roles: ["public"],
  },
  {
    path: "/analysis/jeemain",
    element: withSuspense(JEEMainAnalysis),
    roles: ["public"],
  },
  {
    path: "/analysis/jeeadvanced",
    element: withSuspense(JEEAdvancedAnalysis),
    roles: ["public"],
  },

  // Admin Routes
  {
    path: "/dashboard",
    element: withSuspense(Dashboard),
    roles: ["admin", "moderator"],
  },
  {
    path: "/admin/batch",
    element: withSuspense(AdminBatch),
    roles: ["admin", "moderator"],
  },
  {
    path: "/admin/academic",
    element: withSuspense(Academic),
    roles: ["admin"],
  },
  {
    path: "/admin/question-bank",
    element: withSuspense(QuestionBankAdmin),
    roles: ["admin"],
  },
  {
    path: "/admin/lectures",
    element: withSuspense(LecturesAdmin),
    roles: ["admin", "moderator"],
  },
  {
    path: "/admin/exams/online",
    element: withSuspense(ExamMasterOnline),
    roles: ["admin"],
  },
  {
    path: "/admin/exams/offline",
    element: withSuspense(ExamMasterOffline),
    roles: ["admin", "moderator"],
  },
  { path: "/admin/users", element: withSuspense(UserMaster), roles: ["admin"] },
  {
    path: "/admin/batch/edit/:id",
    element: withSuspense(EditBatch),
    roles: ["admin"],
  },
  {
    path: "/admin/jee-data",
    element: withSuspense(JEEData),
    roles: ["admin", "moderator"],
  },

  // User Routes (Scholars, Moderators, Admins)
  {
    path: "/lectures",
    element: withSuspense(Lectures),
    roles: ["scholar", "admin"],
  },
  {
    path: "/batch",
    element: withSuspense(Batches),
    roles: ["scholar", "admin"],
  },
  {
    path: "/batch/:id",
    element: withSuspense(BatchDetails),
    roles: ["scholar", "admin"],
  },
  { path: "/books", element: withSuspense(Books), roles: ["scholar", "admin"] },
  {
    path: "/profile",
    element: withSuspense(Profile),
    roles: ["scholar", "admin", "moderator"],
  },
  {
    path: "/doubts",
    element: withSuspense(Doubts),
    roles: ["scholar", "admin", "moderator"],
  },
  {
    path: "/doubts/:id",
    element: withSuspense(DoubtDetails),
    roles: ["scholar", "admin", "moderator"],
  },
  {
    path: "/chat",
    element: withSuspense(Chat),
    roles: ["scholar", "admin", "moderator"],
  },
  {
    path: "/question-bank",
    element: withSuspense(QuestionBank),
    roles: ["scholar", "admin", "moderator"],
  },
  {
    path: "/api-docs",
    element: withSuspense(SwaggerDocs),
    roles: ["public"],
  },

  // Catch-All for Not Found
  { path: "/*", element: withSuspense(NotFound), roles: ["public"] },
];

const router = createBrowserRouter([
  {
    element: <MasterLayout />,
    children: routes.map((route) => ({
      path: route.path,
      element: (
        <ProtectedRoute allowedRoles={route.roles}>
          {route.element}
        </ProtectedRoute>
      ),
    })),
  },
]);

export default router;
