import {
  HomeRounded,
  LibraryBooksRounded,
  LocationCityRounded,
  PausePresentationRounded,
  QuestionAnswer,
  SchoolRounded,
} from "@mui/icons-material";
import React from "react";

interface Option {
  label: string;
  path: string;
  icon?: React.ElementType;
  role?: string[];
  loginRequired?: boolean;
}

interface Button {
  label: string;
  path?: string;
  icon: React.ElementType;
  type: "button" | "menu";
  options?: Option[];
  color?: string;
  size?: number;
  role?: string[];
  loginRequired?: boolean;
}

export const buttons: Button[] = [
  {
    label: "Home",
    path: "/",
    icon: HomeRounded,
    color: "#28844f",
    type: "button",
    size: 20,
    loginRequired: false,
  },
  {
    label: "Admin",
    icon: LocationCityRounded,
    type: "menu",
    color: "#fff",
    size: 20,
    loginRequired: true,
    role: ["admin"],
    options: [
      {
        label: "Academic Info",
        path: "/admin/academic",
        loginRequired: true,
      },
      {
        label: "Batch",
        path: "/admin/batch",
        loginRequired: true,
      },
      {
        label: "Lectures",
        path: "/admin/lectures",
        loginRequired: true,
      },
      {
        label: "Online Exams",
        path: "/admin/exams/online",
        loginRequired: true,
      },
      {
        label: "Offline Exams",
        path: "/admin/exams/offline",
        loginRequired: true,
      },
    ],
  },
  {
    label: "Lectures",
    path: "/lectures",
    icon: SchoolRounded,
    color: "#28844f",
    type: "button",
    size: 20,
    loginRequired: true,
    role: ["admin", "student"],
  },
  {
    label: "Batch",
    path: "/batch",
    icon: SchoolRounded,
    type: "button",
    loginRequired: true,
  },
  {
    label: "Books",
    path: "/books",
    icon: LibraryBooksRounded,
    type: "button",
    color: "#28844f",
    size: 20,
    loginRequired: true,
    role: ["admin", "student"],
  },
  {
    label: "Exams",
    path: "",
    icon: PausePresentationRounded,
    type: "menu",
    loginRequired: true,
    options: [
      {
        label: "Online Exam",
        path: "/exams/online",
      },
      {
        label: "offline Exam",
        path: "/exams/offline",
      },
    ],
  },
  {
    label: "JEE Main",
    icon: LocationCityRounded,
    type: "menu",
    color: "#fff",
    size: 20,
    loginRequired: false,
    options: [
      {
        label: "JEE City Info Download",
        path: "/automation/jeemain/cityinfo",
        icon: LocationCityRounded,
        loginRequired: false,
      },
      {
        label: "JEE Admit Card Download",
        path: "/automation/jeemain/admitcard",
        icon: LocationCityRounded,
        loginRequired: false,
      },
    ],
  },
  {
    label: "Doubts",
    path: "/doubts",
    icon: QuestionAnswer,
    loginRequired: false,
    type: "button",
  },
];
