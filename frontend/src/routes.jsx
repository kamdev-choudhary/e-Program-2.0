import React, { Suspense } from "react";
import Loader from "./components/Loader";

const Article = React.lazy(() => import("./pages/article/Article"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Library = React.lazy(() => import("./pages/library/Library"));
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = React.lazy(() => import("./pages/auth/SignUpPage"));
const Lectures = React.lazy(() => import("./pages/lectures/Lectures"));

const createRoute = (path, name, available, Component) => ({
  path,
  name,
  available,
  element: (
    <Suspense fallback={<Loader open={true} />}>
      <Component />
    </Suspense>
  ),
});

export const routes = [
  createRoute("/", "Home", ["0"], Home),
  createRoute("/article", "Article", ["0"], Article),
  createRoute("/library", "Library", ["0"], Library),
  createRoute("/lectures", "Lectures", ["0"], Lectures),
  createRoute("/login", "Login", ["0"], LoginPage),
  createRoute("/signup", "Sign Up", ["0"], SignUpPage),
];
