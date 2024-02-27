import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

import Lectures from "./pages/lectures/Lectures";
import HomePage from "./pages/home/index";
import Exams from "./pages/exams/Exams";
import Syllabus from "./pages/syllabus/Syllabus";
import Library from "./pages/library/library";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LogoutUser from "./pages/LogoutUser/LogoutUser";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="container ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<LoginPage />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutUser />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
