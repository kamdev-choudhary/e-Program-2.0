import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/Auth";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ErrorPage from "./components/ErrorPage";
import StudentProfile from "./components/StudentProfile";
import Sidebar from "./components/Sidebar";
import AdminPage from "./pages/admin/AdminPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import ExamPage from "./pages/exams/ExamPage";
import LecturePage from "./pages/student/LecturePage";
import MaterialPage from "./pages/student/MaterialPage";
import QuestionBankPage from "./pages/questions/QuestionBankPage";
import UserMaster from "./pages/admin/UserMaster";
import AcademicPage from "./pages/admin/AcademicPage";
import ExamMaster from "./pages/exams/ExamMaster";
import DoubtPage from "./pages/doubts/DoubtPage";
import { Box, useMediaQuery, Grid } from "@mui/material";

const AppRouter = () => {
  const { accountType, isLoggedIn } = useAuth();

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {isLoggedIn && (
            <Route
              path="/dashboard"
              element={
                accountType === "admin" ? (
                  <AdminPage />
                ) : (
                  <StudentDashboardPage />
                )
              }
            />
          )}
          <Route path="/exams" element={<ExamPage />} />
          <Route path="/lectures" element={<LecturePage />} />
          <Route path="/materials" element={<MaterialPage />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/question-bank" element={<QuestionBankPage />} />
          <Route path="/users" element={<UserMaster />} />
          <Route path="/academic" element={<AcademicPage />} />
          <Route path="/examtemplate" element={<ExamMaster />} />
          <Route path="/doubts" element={<DoubtPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Box>
    </>
  );
};

function App() {
  const { isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isMdScreen = useMediaQuery("(min-width:960px)");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <Navbar sx={{ zIndex: 1000 }} />
          {isMdScreen ? (
            <Grid container sx={{ marginTop: 1 }}>
              <Grid item md={2} sx={{ position: "fixed", top: 0, bottom: 0 }}>
                <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
              </Grid>
              <Grid
                item
                md={10}
                sx={{ marginLeft: "14.2%", overflowY: "auto" }}
              >
                <AppRouter />
              </Grid>
            </Grid>
          ) : (
            <Box>
              <AppRouter />
            </Box>
          )}
        </>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
