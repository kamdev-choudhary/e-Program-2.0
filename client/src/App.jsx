import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/Auth";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ErrorPage from "./components/ErrorPage";
import StudentProfile from "./components/StudentProfile";
import Sidebar from "./components/Sidebar";
import AdminPage from "./pages/admin/AdminPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import ExamPage from "./pages/exams/ExamPage";
import LecturePage from "./pages/student/LecturePage";
import MaterialPage from "./pages/student/MaterialPage";
import QuestionBankPage from "./pages/questions/QuestionBankPage";
import Drawer from "@mui/material/Drawer";
import { List } from "@mui/icons-material";
import { ListItem, Typography } from "@mui/material";
import UserMaster from "./pages/admin/UserMaster";
import AcademicPage from "./pages/admin/AcademicPage";
import ExamMaster from "./pages/exams/ExamMaster";
import DoubtPage from "./pages/doubts/DoubtPage";
import { Box, useMediaQuery, Grid, Stack } from "@mui/material";
import ExamMasterOffline from "./pages/exams/ExamMasterOffline";
import Layout from "./components/Layout";

const drawerWidth = 240;

const AppRouter = () => {
  const { accountType, isLoggedIn } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {isLoggedIn && (
          <Route
            path="/dashboard"
            element={
              accountType === "admin" ? <AdminPage /> : <StudentDashboardPage />
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
        <Route path="/exammaster/online" element={<ExamMaster />} />
        <Route path="/exammaster/offline" element={<ExamMasterOffline />} />
        <Route path="/doubts" element={<DoubtPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

function App() {
  const { isLoggedIn } = useAuth();

  const isMdScreen = useMediaQuery("(min-width:700px)");

  return (
    <AuthProvider>
      <BrowserRouter>
        {isMdScreen ? (
          <Grid container>
            <Grid item lg={2} md={2} sx={{ height: "100vh" }}>
              <Sidebar />
            </Grid>
            <Grid item flexGrow={1} lg={10} xs={12} md={10}>
              <Navbar />
              <Box
                sx={{
                  height: "90vh",
                  overflow: "auto",
                  padding: 2,
                  marginTop: 1,
                }}
              >
                <AppRouter />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <>
            <Navbar />
            <Box
              sx={{
                height: "90vh",
                overflow: "auto",
                padding: 1,
                marginTop: 1,
              }}
            >
              <AppRouter />
            </Box>
          </>
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
