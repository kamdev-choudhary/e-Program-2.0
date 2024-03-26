import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ExamPage from "./pages/ExamPage";
import LecturePage from "./pages/LecturePage";
import MaterialPage from "./pages/MaterialPage";
import AdminPage from "./pages/AdminPage";
import QuestionBankPage from "./pages/QuestionBankPage";
import ErrorPage from "./components/ErrorPage";
import Users from "./components/Users";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/admin" Component={AdminPage} />
          <Route path="/dashboard" Component={DashboardPage} />
          <Route path="/exams" Component={ExamPage} />
          <Route path="/lectures" Component={LecturePage} />
          <Route path="/materials" Component={MaterialPage} />
          <Route path="/question bank" Component={QuestionBankPage} />
          <Route path="/admin/users" Component={Users} />
          <Route path="/register" Component={RegisterPage} />
          <Route path="*" Component={ErrorPage} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
