import {
  DashboardRounded,
  SecurityRounded,
  GroupRounded,
  MenuBookRounded,
  ImportContactsRounded,
  ComputerRounded,
  DescriptionRounded,
  CloudRounded,
  TableChartRounded,
  GroupsRounded,
  PlayLessonRounded,
  QuizRounded,
  LocationOnRounded,
  AssignmentIndRounded,
  CreateRounded,
  InsightsRounded,
  AssessmentRounded,
  BarChartRounded,
  SettingsSuggestRounded,
} from "@mui/icons-material";
import React from "react";

interface Option {
  label: string;
  path: string;
  icon: React.ElementType;
  color?: string;
  role?: string[];
  loginRequired?: boolean;
}

interface Button {
  label: string;
  path?: string;
  icon: React.ElementType;
  color?: string;
  type: "button" | "menu";
  options?: Option[];
  role?: string[];
  loginRequired?: boolean;
}

export const buttons: Button[] = [
  {
    label: "Home",
    path: "/",
    icon: DashboardRounded,
    color: "#0073E6",
    type: "button",
    loginRequired: false,
  },
  {
    label: "Admin",
    icon: SecurityRounded,
    type: "menu",
    color: "#673AB7",
    loginRequired: true,
    role: ["admin"],
    options: [
      {
        label: "User Master",
        path: "/admin/users",
        loginRequired: true,
        color: "#009688",
        icon: GroupRounded,
      },
      {
        label: "Academic Info",
        path: "/admin/academic",
        loginRequired: true,
        icon: MenuBookRounded,
        color: "#FF5722",
      },
      {
        label: "Books",
        path: "/admin/books",
        icon: ImportContactsRounded,
        loginRequired: true,
        color: "#4CAF50",
      },
      {
        label: "Online Exams",
        path: "/admin/exams/online",
        loginRequired: true,
        icon: ComputerRounded,
        color: "#1E88E5",
      },
      {
        label: "Offline Exams",
        path: "/admin/exams/offline",
        loginRequired: true,
        icon: DescriptionRounded,
        color: "#FFB300",
      },
    ],
  },
  {
    label: "Data",
    type: "menu",
    icon: CloudRounded,
    loginRequired: true,
    color: "#8D6E63",
    role: ["admin"],
    options: [
      {
        label: "JEE Data",
        path: "/admin/jee-data",
        loginRequired: true,
        icon: TableChartRounded,
        color: "#FF7043",
      },
      {
        label: "Batch",
        path: "/admin/batch",
        loginRequired: true,
        icon: GroupsRounded,
        color: "#4DB6AC",
      },
      {
        label: "Lectures",
        path: "/admin/lectures",
        loginRequired: true,
        icon: PlayLessonRounded,
        color: "#42A5F5",
      },
    ],
  },
  {
    label: "Lectures",
    path: "/lectures",
    icon: PlayLessonRounded,
    type: "button",
    loginRequired: true,
    color: "#1E88E5",
    role: ["admin", "student"],
  },
  {
    label: "Batch",
    path: "/batch",
    icon: GroupsRounded,
    type: "button",
    loginRequired: true,
    color: "#26A69A",
    role: ["admin"],
  },
  {
    label: "Exams",
    icon: QuizRounded,
    type: "menu",
    role: ["admin"],
    loginRequired: true,
    color: "#FF7043",
    options: [
      {
        label: "Online Exam",
        path: "/exams/online",
        icon: ComputerRounded,
        color: "#29B6F6",
      },
      {
        label: "Offline Exam",
        path: "/exams/offline",
        icon: DescriptionRounded,
        color: "#FFD54F",
      },
    ],
  },
  {
    label: "Automation",
    icon: SettingsSuggestRounded,
    type: "menu",
    role: ["admin"],
    loginRequired: false,
    color: "#FF8A65",
    options: [
      {
        label: "JEE City Info",
        path: "/automation/jeemaincityinfo",
        icon: LocationOnRounded,
        loginRequired: false,
        color: "#43A047",
      },
      {
        label: "JEE Admit Card",
        path: "/automation/jeemainadmitcard",
        icon: AssignmentIndRounded,
        loginRequired: false,
        color: "#D32F2F",
      },
      {
        label: "Generate Admit Card",
        path: "/automation/jdstadmitcard",
        icon: CreateRounded,
        loginRequired: false,
        color: "#1976D2",
      },
    ],
  },
  {
    label: "Analysis",
    icon: InsightsRounded,
    path: "",
    role: ["admin"],
    loginRequired: true,
    type: "menu",
    color: "#FF9800",
    options: [
      {
        label: "JEE Main",
        path: "/analysis/jeemain",
        icon: AssessmentRounded,
        loginRequired: false,
        color: "#29B6F6",
      },
      {
        label: "JEE Advanced",
        path: "/analysis/jeeadvanced",
        icon: BarChartRounded,
        loginRequired: false,
        color: "#8E24AA",
      },
    ],
  },
];
