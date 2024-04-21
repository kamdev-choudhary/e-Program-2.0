import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ErrorPage from "./components/ErrorPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/StudentDashboardPage";
import ExamPage from "./pages/ExamPage";
import LecturePage from "./pages/LecturePage";
import MaterialPage from "./pages/MaterialPage";
import QuestionBankPage from "./pages/QuestionBankPage";
import UserMaster from "./pages/UserMaster";
import AcademicPage from "./pages/AcademicPage";
import StudentProfile from "./components/StudentProfile";
import ExamMaster from "./pages/ExamMaster";
import DoubtPage from "./pages/DoubtPage";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Sidebar from "./components/Sidebar";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
  const { accountType } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detect screen size
  const isMdScreen = useMediaQuery("(min-width:960px)");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Grid container>
          {isMdScreen && (
            <Grid item md={sidebarOpen ? 2 : 0}>
              <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            </Grid>
          )}
          <Grid
            item
            md={isMdScreen ? (sidebarOpen ? 10 : 12) : 12}
            flexGrow={1}
          >
            <Navbar />
            <Box sx={{ padding: 2, overflowY: "auto" }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    accountType && accountType === "admin" ? (
                      <AdminPage />
                    ) : (
                      <HomePage />
                    )
                  }
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/exams" element={<ExamPage />} />
                <Route path="/lectures" element={<LecturePage />} />
                <Route path="/materials" element={<MaterialPage />} />
                <Route
                  path="/profile"
                  element={<ProtectedRoute Component={StudentProfile} />}
                />
                <Route
                  path="/question-bank"
                  element={<ProtectedRoute Component={QuestionBankPage} />}
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute Component={AdminPage} isAdminRequired />
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute Component={UserMaster} isAdminRequired />
                  }
                />
                <Route
                  path="/academic"
                  element={
                    <ProtectedRoute Component={AcademicPage} isAdminRequired />
                  }
                />
                <Route
                  path="/examtemplate"
                  element={
                    <ProtectedRoute Component={ExamMaster} isAdminRequired />
                  }
                />
                <Route path="/doubts" element={<DoubtPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Box>
          </Grid>
        </Grid>
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedRoute({ Component, isAdminRequired }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (isAdminRequired && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
}

export default App;
