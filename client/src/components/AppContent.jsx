import React from "react";
import { Box } from "@mui/material";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import ErrorPage from "./ErrorPage";
import AdminPage from "../pages/AdminPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/StudentDashboardPage";
import ExamPage from "../pages/ExamPage";
import LecturePage from "../pages/LecturePage";
import MaterialPage from "../pages/MaterialPage";
import QuestionBankPage from "../pages/QuestionBankPage";
import UserMaster from "../pages/UserMaster";
import AcademicPage from "../pages/AcademicPage";
import StudentProfile from "../components/StudentProfile";
import ExamMaster from "../pages/ExamMaster";
import DoubtPage from "../pages/DoubtPage";

import { useAuth } from "./Auth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { accountType } = useAuth();

  if (!accountType) {
    return <Navigate to="/" />;
  }

  if (rest.isAdminRequired && accountType !== "admin") {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default function AppContent() {
  return (
    <Box sx={{ padding: 2, overflowY: "auto" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exams" element={<ExamPage />} />
          <Route path="/lectures" element={<LecturePage />} />
          <Route path="/materials" element={<MaterialPage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute component={StudentProfile} />}
          />
          <Route
            path="/question-bank"
            element={<ProtectedRoute component={QuestionBankPage} />}
          />
          <Route
            path="/admin/*"
            element={<ProtectedRoute component={AdminPage} isAdminRequired />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute component={UserMaster} isAdminRequired />}
          />
          <Route
            path="/academic"
            element={
              <ProtectedRoute component={AcademicPage} isAdminRequired />
            }
          />
          <Route
            path="/examtemplate"
            element={<ProtectedRoute component={ExamMaster} isAdminRequired />}
          />
          <Route path="/doubts" element={<DoubtPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
