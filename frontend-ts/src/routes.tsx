import { lazy, Suspense, ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./layout/ProtectedRoute";
import MasterLayout from "./layout/MasterLayout";
import Loader from "./components/Loader";

// Public Pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const NotFound = lazy(() => import("./layout/NotFound"));
const Unauthorized = lazy(() => import("./layout/Unauthorized"));

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
const JEEMainResult = lazy(() => import("./pages/automations/JEEMainResult"));

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
const SuffleQuestionInWord = lazy(
  () => import("./pages/tools/SuffleQuestionInWord")
);

import { UserRole, ROLES } from "./constant/roles";

interface RouteType {
  path: string;
  element: ReactNode;
  roles: UserRole[]; // Optional to allow public access
}

// 🔹 Centralized Route Definitions 🔹
const routes: RouteType[] = [
  // Public Routes
  { path: "/", element: <HomePage />, roles: ["public"] },
  { path: "/unauthorized", element: <Unauthorized />, roles: ["public"] },
  {
    path: "/automation/jeemaincityinfo",
    element: <JEEMainCityInfo />,
    roles: ["public"],
  },
  {
    path: "/automation/jeemainadmitcard",
    element: <JEEMainAdmitCard />,
    roles: ["public"],
  },
  {
    path: "/automation/jdstadmitcard",
    element: <GenerateAdmitCard />,
    roles: ["public"],
  },
  {
    path: "/automation/jeemainprovisionalanswerkey",
    element: <JeeMainProvisionalKey />,
    roles: ["public"],
  },
  {
    path: "/automation/jeemainresult",
    element: <JEEMainResult />,
    roles: ["public"],
  },
  {
    path: "/analysis/jeemain",
    element: <JEEMainAnalysis />,
    roles: ["public"],
  },
  {
    path: "/analysis/jeeadvanced",
    element: <JEEAdvancedAnalysis />,
    roles: ["public"],
  },

  // Admin Routes
  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/manage/batch",
    element: <AdminBatch />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/manage/academic",
    element: <Academic />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/manage/question-bank",
    element: <QuestionBankAdmin />,
    roles: [ROLES.ADMIN],
  },

  {
    path: "/manage/exams/online",
    element: <ExamMasterOnline />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "/manage/exams/offline",
    element: <ExamMasterOffline />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },
  { path: "/admin/users", element: <UserMaster />, roles: [ROLES.ADMIN] },
  {
    path: "/manage/lectures",
    element: <LecturesAdmin />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/manage/batch/edit/:id",
    element: <EditBatch />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "/manage/jee-data",
    element: <JEEData />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },

  // User Routes
  {
    path: "/lectures",
    element: <Lectures />,
    roles: [ROLES.STUDENT, ROLES.ADMIN],
  },
  { path: "/batch", element: <Batches />, roles: [ROLES.STUDENT, ROLES.ADMIN] },
  {
    path: "/batch/:id",
    element: <BatchDetails />,
    roles: [ROLES.STUDENT, ROLES.ADMIN],
  },
  { path: "/books", element: <Books />, roles: [ROLES.STUDENT, ROLES.ADMIN] },
  {
    path: "/profile",
    element: <Profile />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/doubts",
    element: <Doubts />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/doubts/:id",
    element: <DoubtDetails />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/chat",
    element: <Chat />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/question-bank",
    element: <QuestionBank />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/tools/suffle-question",
    element: <SuffleQuestionInWord />,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },

  // Catch-All Route
  { path: "/*", element: <NotFound />, roles: ["public"] },
];

// 🔹 Optimized Router Setup 🔹
const router = createBrowserRouter([
  {
    element: <MasterLayout />,
    children: routes.map(({ path, element, roles }) => ({
      path,
      element: (
        <ProtectedRoute allowedRoles={roles}>
          <Suspense fallback={<Loader />}>{element}</Suspense>
        </ProtectedRoute>
      ),
    })),
  },
]);

export default router;
