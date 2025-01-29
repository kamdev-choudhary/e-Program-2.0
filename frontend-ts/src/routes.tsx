import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute";
import withSuspense from "./hooks/WithSuspense";
import MasterLayout from "./layout/MasterLayout";

// Lazy Load Components
const lazyLoad = (path: string) =>
  withSuspense(lazy(() => import(`./pages/${path}`)));

// Public Pages
const HomePage = lazyLoad("home/HomePage");
const NotFound = lazyLoad("error/NotFound");
const Unauthorized = lazyLoad("error/Unauthorized");

// Automation & Analysis
const DCI = lazyLoad("automations/DownloadCityInformation");
const DAC = lazyLoad("automations/DownloadJeeMainAdmitCard");
const GenerateAdmitCard = lazyLoad("automations/GenerateAdmitCard");
const JEEMainAnalysis = lazyLoad("analysis/JEEmainAnalysis");

// Admin Pages
const Dashboard = lazyLoad("dashboard/Dashboard");
const AdminBatch = lazyLoad("admin/batch/Batch");
const Academic = lazyLoad("admin/academic/Academic");
const QuestionBankAdmin = lazyLoad("question/QuestionBank");
const LecturesAdmin = lazyLoad("admin/lectures/Lectures");
const ExamMasterOnline = lazyLoad("admin/exams/ExamMasterOnline");
const ExamMasterOffline = lazyLoad("admin/exams/ExamMasterOffline");
const UserMaster = lazyLoad("admin/user/UserMaster");
const EditBatch = lazyLoad("admin/batch/EditBatch");
const JEEData = lazyLoad("admin/analysis/JEEData");

// User Pages (Students, Moderators, Admins)
const Lectures = lazyLoad("lectures/Lectures");
const Batches = lazyLoad("batch/Batches");
const BatchDetails = lazyLoad("batch/BatchDetails");
const Books = lazyLoad("books/Books");
const Profile = lazyLoad("auth/Profile");
const Doubts = lazyLoad("doubts/Doubts");
const DoubtDetails = lazyLoad("doubts/DoubtDetails");
const Chat = lazyLoad("chat/Chat");
const QuestionBank = lazyLoad("question/QuestionBank");

interface RoutesProps {
  path: string;
  element: React.FC<any>;
  roles: string[];
}

// **Role-Based Routes**
const routes: RoutesProps[] = [
  // Public Routes
  { path: "/", element: HomePage, roles: ["public"] },
  { path: "/unauthorized", element: Unauthorized, roles: ["public"] },
  { path: "/automation/jeemaincityinfo", element: DCI, roles: ["public"] },
  { path: "/automation/jeemainadmitcard", element: DAC, roles: ["public"] },
  {
    path: "/automation/jdstadmitcard",
    element: GenerateAdmitCard,
    roles: ["public"],
  },
  { path: "/analysis/jeemain", element: JEEMainAnalysis, roles: ["public"] },

  // Admin Routes
  { path: "/admin/dashboard", element: Dashboard, roles: ["admin"] },
  { path: "/admin/batch", element: AdminBatch, roles: ["admin", "moderator"] },
  { path: "/admin/academic", element: Academic, roles: ["admin"] },
  {
    path: "/admin/question-bank",
    element: QuestionBankAdmin,
    roles: ["admin"],
  },
  {
    path: "/admin/lectures",
    element: LecturesAdmin,
    roles: ["admin", "moderator"],
  },
  { path: "/admin/exams/online", element: ExamMasterOnline, roles: ["admin"] },
  {
    path: "/admin/exams/offline",
    element: ExamMasterOffline,
    roles: ["admin", "moderator"],
  },
  { path: "/admin/users", element: UserMaster, roles: ["admin"] },
  { path: "/admin/batch/edit/:id", element: EditBatch, roles: ["admin"] },
  { path: "/admin/jee-data", element: JEEData, roles: ["admin", "moderator"] },

  // User Routes (Students, Moderators, Admins)
  { path: "/lectures", element: Lectures, roles: ["student", "admin"] },
  { path: "/batch", element: Batches, roles: ["student", "admin"] },
  { path: "/batch/:id", element: BatchDetails, roles: ["student", "admin"] },
  { path: "/books", element: Books, roles: ["student", "admin"] },
  {
    path: "/profile",
    element: Profile,
    roles: ["student", "admin", "moderator"],
  },
  {
    path: "/doubts",
    element: Doubts,
    roles: ["student", "admin", "moderator"],
  },
  {
    path: "/doubts/:id",
    element: DoubtDetails,
    roles: ["student", "admin", "moderator"],
  },
  { path: "/chat", element: Chat, roles: ["student", "admin", "moderator"] },
  {
    path: "/question-bank",
    element: QuestionBank,
    roles: ["student", "admin", "moderator"],
  },

  // Catch-All for Not Found
  { path: "/*", element: NotFound, roles: ["public"] },
];

// **Wrap Routes with `ProtectedRoute`**
const router = createBrowserRouter([
  {
    element: <MasterLayout />,
    children: routes.map(({ path, element, roles }) => ({
      path,
      element: (
        <ProtectedRoute allowedRoles={roles}>
          {React.createElement(element)}
        </ProtectedRoute>
      ),
    })),
  },
]);

export default router;
