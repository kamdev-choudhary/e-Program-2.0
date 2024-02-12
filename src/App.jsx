import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lectures from "./views/lectures/Lectures";
import HomePage from "./views/home/index";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import Exams from "./views/exams/Exams";
import Syllabus from "./views/syllabus/Syllabus";
import Library from "./views/library/library";
import ErrorPage from "./views/ErrorPage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import LogoutUser from "./views/LogoutUser";

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
