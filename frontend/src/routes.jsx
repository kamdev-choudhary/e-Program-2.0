import React, { Suspense } from "react";
import Loader from "./components/Loader";

const Article = React.lazy(() => import("./pages/article/Article"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Library = React.lazy(() => import("./pages/library/Library"));
const Lectures = React.lazy(() => import("./pages/lectures/Lectures"));
const Users = React.lazy(() => import("./pages/admin/Users"));
const LectureAdmin = React.lazy(() => import("./pages/lectures/LectureAdmin"));
const OnlineExam = React.lazy(() => import("./pages/exam/OnlineExam"));
const OfflineExam = React.lazy(() => import("./pages/exam/OfflineExam"));
const ExamMaster = React.lazy(() => import("./pages/exam/ExamMaster"));
const QuestionBank = React.lazy(() => import("./pages/question/QuestionBank"));
const Message = React.lazy(() => import("./pages/messages/Message"));
const BookOpen = React.lazy(() => import("./pages/library/BookOpen"));
const MetaData = React.lazy(() => import("./pages/admin/MetaData"));
const Batch = React.lazy(() => import("./pages/admin/Batch"));

const createRoute = (path, name, isLoginRequired, available, Component) => ({
  path,
  name,
  isLoginRequired,
  available,
  element: (
    <Suspense fallback={<Loader open={true} />}>
      <Component />
    </Suspense>
  ),
});

export const routes = [
  createRoute("/", "Home", false, ["0"], Home),
  createRoute("/article", "Articles", false, ["0"], Article),
  createRoute("/library", "Library", false, ["0"], Library),
  createRoute("/lectures", "Lectures", false, ["0"], Lectures),
  createRoute("/admin/lectures", "Lectures", true, ["admin"], LectureAdmin),
  createRoute("/admin/users", "Users", true, ["admin"], Users),
  createRoute(
    "/admin/exam/online",
    "Exam Master Online",
    true,
    ["admin"],
    OnlineExam
  ),
  createRoute(
    "/admin/exam/offline",
    "Exam Master Online",
    true,
    ["admin"],
    OfflineExam
  ),
  createRoute(
    "/admin/exam/master",
    "Exam Master Online",
    true,
    ["admin"],
    ExamMaster
  ),
  createRoute(
    "/admin/question-bank",
    "Question Bank",
    true,
    ["admin"],
    QuestionBank
  ),
  createRoute("/admin/metadata", "Academic Info", true, ["admin"], MetaData),
  createRoute("/message", "Message", false, ["all"], Message),
  createRoute("/library/book/:id", "Open Book", false, ["all"], BookOpen),
  createRoute("/admin/batches", "Batch", false, ["All"], Batch),
];
