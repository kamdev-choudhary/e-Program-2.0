import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth";
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

function App() {
  const { accountType } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Grid container>
          <Grid item xs={12} sm={2}>
            <Box
              sx={{
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden",
                display: { xs: "none", sm: "block" },
              }}
            >
              <Sidebar />
            </Box>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                height: "100vh",
                overflowY: "auto",
              }}
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
                      <ProtectedRoute
                        Component={AcademicPage}
                        isAdminRequired
                      />
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
