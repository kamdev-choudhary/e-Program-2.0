import { Suspense, ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./layout/ProtectedRoute";
import MasterLayout from "./layout/MasterLayout";
import Loader from "./components/Loader";
import lazyLoad from "./utils/lazyload";

import { UserRole, ROLES } from "./constant/roles";

// Public Pages
const HomePage = lazyLoad(() => import("./pages/home/HomePage"));
const NotFound = lazyLoad(() => import("./layout/NotFound"));

// Automation & Analysis
const JEEMainCityInfo = lazyLoad(
  () => import("./pages/automations/JEEMainCityInformation")
);
const JEEMainAdmitCard = lazyLoad(
  () => import("./pages/automations/JeeMainAdmitCard")
);
const GenerateAdmitCard = lazyLoad(
  () => import("./pages/automations/GenerateAdmitCard")
);
const JEEMainAnalysis = lazyLoad(
  () => import("./pages/analysis/JEEmainAnalysis")
);
const JeeMainProvisionalKey = lazyLoad(
  () => import("./pages/automations/JeeMainProvisionalKey")
);
const JEEAdvancedAnalysis = lazyLoad(
  () => import("./pages/analysis/JEEAdvancedAnalysis")
);
const JEEMainResult = lazyLoad(
  () => import("./pages/automations/JEEMainResult")
);
const JEEMainResult01 = lazyLoad(
  () => import("./pages/automations/JEEMainResult01")
);
const TestPage = lazyLoad(() => import("./pages/test/Test"));

// Admin Pages
const Dashboard = lazyLoad(() => import("./pages/dashboard/Dashboard"));
const AdminBatch = lazyLoad(() => import("./pages/admin/batch/Batch"));
const Academic = lazyLoad(() => import("./pages/admin/academic/Academic"));
const QuestionBankAdmin = lazyLoad(
  () => import("./pages/question/QuestionBank")
);
const LecturesAdmin = lazyLoad(() => import("./pages/admin/lectures/Lectures"));
const ExamMasterOnline = lazyLoad(
  () => import("./pages/admin/exams/ExamMasterOnline")
);
const ExamMasterOffline = lazyLoad(
  () => import("./pages/admin/exams/ExamMasterOffline")
);
const UserMaster = lazyLoad(() => import("./pages/admin/user/UserMaster"));
const EditBatch = lazyLoad(() => import("./pages/admin/batch/EditBatch"));
const JEEData = lazyLoad(() => import("./pages/admin/analysis/JEEData"));

// User Pages (Scholars, Moderators, Admins)
const Lectures = lazyLoad(() => import("./pages/lectures/Lectures"));
const Batches = lazyLoad(() => import("./pages/batch/Batches"));
const BatchDetails = lazyLoad(() => import("./pages/batch/BatchDetails"));
const Books = lazyLoad(() => import("./pages/books/Books"));
const Profile = lazyLoad(() => import("./pages/auth/Profile"));
const Doubts = lazyLoad(() => import("./pages/doubts/Doubts"));
const DoubtDetails = lazyLoad(() => import("./pages/doubts/DoubtDetails"));
const Chat = lazyLoad(() => import("./pages/chat/Chat"));
const QuestionBank = lazyLoad(() => import("./pages/question/QuestionBank"));

// Tools
const SuffleQuestionInWord = lazyLoad(
  () => import("./pages/tools/suffle-questions/SuffleQuestionInWord")
);
const PDFCompressor = lazyLoad(
  () => import("./pages/tools/pdf-compressor/PdfCompressor")
);

interface RouteType {
  path: string;
  element: ReactNode;
  roles: UserRole[]; // Optional to allow public access
}

// 🔹 Centralized Route Definitions 🔹
const routes: RouteType[] = [
  // Public Routes
  { path: "/", element: <HomePage />, roles: [ROLES.PUBLIC] },
  {
    path: "/automation/jeemaincityinfo",
    element: <JEEMainCityInfo />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/automation/jeemainadmitcard",
    element: <JEEMainAdmitCard />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/automation/jdstadmitcard",
    element: <GenerateAdmitCard />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/automation/jeemainprovisionalanswerkey",
    element: <JeeMainProvisionalKey />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/automation/jeemainresult",
    element: <JEEMainResult />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/automation/jeemainresult-01",
    element: <JEEMainResult01 />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/analysis/jeemain",
    element: <JEEMainAnalysis />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/analysis/jeeadvanced",
    element: <JEEAdvancedAnalysis />,
    roles: [ROLES.PUBLIC],
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
    path: "/chats",
    element: <Chat />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    path: "/question-bank",
    element: <QuestionBank />,
    roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.MODERATOR],
  },

  // Tools
  {
    path: "/tools/suffle-question",
    element: <SuffleQuestionInWord />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/tools/pdf-compressor",
    element: <PDFCompressor />,
    roles: [ROLES.PUBLIC],
  },
  {
    path: "/test",
    element: <TestPage />,
    roles: [ROLES.PUBLIC],
  },
  // Catch-All Route
  { path: "/*", element: <NotFound />, roles: [ROLES.PUBLIC] },
];

// 🔹 Optimized Router Setup 🔹
const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Loader open={true} />}>
        <MasterLayout />
      </Suspense>
    ),
    children: routes.map(({ path, element, roles }) => ({
      path,
      element: <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>,
    })),
  },
]);

export default router;
