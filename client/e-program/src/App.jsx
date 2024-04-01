import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/StudentDashboardPage";
import ExamPage from "./pages/ExamPage";
import LecturePage from "./pages/LecturePage";
import MaterialPage from "./pages/MaterialPage";
import AdminPage from "./pages/AdminPage";
import QuestionBankPage from "./pages/QuestionBankPage";
import ErrorPage from "./components/ErrorPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./components/Auth";
import StudentProfile from "./components/StudentProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/exams" element={<ExamPage />} />
            <Route path="/lectures" element={<LecturePage />} />
            <Route path="/materials" element={<MaterialPage />} />
            <Route path="/question-bank" element={<QuestionBankProtected />} />
            <Route path="/admin/*" element={<AdminRoute />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function AdminRoute() {
  const { isAdmin } = useAuth();

  return isAdmin ? <AdminPage /> : <Navigate to="/" replace />;
}

function QuestionBankProtected() {
  const { isAdmin } = useAuth();

  return isAdmin ? <QuestionBankPage /> : <Navigate to="/" replace />;
}

export default App;
