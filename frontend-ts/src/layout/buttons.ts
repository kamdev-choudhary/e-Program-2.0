import {
  AdminPanelSettingsRounded,
  BookOnline,
  ClassRounded,
  GroupRounded,
  HomeRounded,
  InfoRounded,
  InsertDriveFileRounded,
  LibraryBooksRounded,
  LocationCityRounded,
  MessageRounded,
  OnlinePrediction,
  PausePresentation,
  PausePresentationRounded,
  PersonRounded,
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
    icon: AdminPanelSettingsRounded,
    type: "menu",
    color: "#fff",
    size: 20,
    loginRequired: true,
    role: ["admin"],

    options: [
      {
        label: "User Master",
        path: "/admin/users",
        loginRequired: true,
        icon: PersonRounded,
      },
      {
        label: "Academic Info",
        path: "/admin/academic",
        loginRequired: true,
        icon: InfoRounded,
      },
      {
        label: "Batch",
        path: "/admin/batch",
        loginRequired: true,
        icon: GroupRounded,
      },
      {
        label: "Lectures",
        path: "/admin/lectures",
        loginRequired: true,
        icon: ClassRounded,
      },
      {
        label: "Online Exams",
        path: "/admin/exams/online",
        loginRequired: true,
        icon: PausePresentation,
      },
      {
        label: "Offline Exams",
        path: "/admin/exams/offline",
        loginRequired: true,
        icon: BookOnline,
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
        icon: OnlinePrediction,
      },
      {
        label: "offline Exam",
        path: "/exams/offline",
        icon: BookOnline,
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
        icon: InsertDriveFileRounded,
        loginRequired: false,
      },
    ],
  },
  {
    label: "Doubts",
    path: "/doubts",
    icon: QuestionAnswer,
    loginRequired: true,
    type: "button",
  },
  {
    label: "Chat",
    path: "/chat",
    icon: MessageRounded,
    loginRequired: true,
    type: "button",
  },
];
