import React, { Suspense } from "react";
import Loader from "./components/Loader";

const Article = React.lazy(() => import("./pages/article/Article"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Library = React.lazy(() => import("./pages/library/Library"));
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = React.lazy(() => import("./pages/auth/SignUpPage"));
const Lectures = React.lazy(() => import("./pages/lectures/Lectures"));
const Users = React.lazy(() => import("./pages/admin/Users"));
const LectureAdmin = React.lazy(() => import("./pages/lectures/LectureAdmin"));

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
  createRoute("/article", "Article", false, ["0"], Article),
  createRoute("/library", "Library", false, ["0"], Library),
  createRoute("/lectures", "Lectures", false, ["0"], Lectures),
  createRoute("/admin/lectures", "Lectures", true, ["admin"], LectureAdmin),
  createRoute("/admin/users", "Users", true, ["admin"], Users),
];
