import {
  DashboardRounded,
  SecurityRounded,
  GroupRounded,
  MenuBookRounded,
  ComputerRounded,
  CloudRounded,
  TableChartRounded,
  GroupsRounded,
  PlayLessonRounded,
  LocationOnRounded,
  AssignmentIndRounded,
  CreateRounded,
  InsightsRounded,
  AssessmentRounded,
  BarChartRounded,
  SettingsSuggestRounded,
  GradingRounded,
  AssignmentTurnedInRounded,
  ShuffleRounded,
  ChatBubbleRounded,
} from "@mui/icons-material";
import React from "react";

import { UserRole, ROLES } from "../constant/roles";

type Option = {
  label: string;
  path: string;
  icon: React.ElementType;
  color?: string;
  roles?: UserRole[];
  loginRequired?: boolean;
};

interface Button {
  label: string;
  path?: string;
  icon: React.ElementType;
  color?: string;
  type: "button" | "menu";
  options?: Option[];
  roles?: string[];
  loginRequired?: boolean;
}

export const buttons: Button[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardRounded,
    color: "#0073E6",
    type: "button",
    loginRequired: true,
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
  },
  {
    label: ROLES.ADMIN,
    icon: SecurityRounded,
    type: "menu",
    color: "#673AB7",
    loginRequired: true,
    roles: [ROLES.ADMIN],
    options: [
      {
        label: "User Master",
        path: "/admin/users",
        loginRequired: true,
        color: "#009688",
        icon: GroupRounded,
      },
      // {
      //   label: "Books",
      //   path: "/admin/books",
      //   icon: ImportContactsRounded,
      //   loginRequired: true,
      //   color: "#4CAF50",
      // },
      // {
      //   label: "Online Exams",
      //   path: "/admin/exams/online",
      //   loginRequired: true,
      //   icon: ComputerRounded,
      //   color: "#1E88E5",
      // },
      // {
      //   label: "Offline Exams",
      //   path: "/admin/exams/offline",
      //   loginRequired: true,
      //   icon: DescriptionRounded,
      //   color: "#FFB300",
      // },
    ],
  },
  {
    label: "Data",
    type: "menu",
    icon: CloudRounded,
    loginRequired: true,
    color: "#8D6E63",
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
    options: [
      {
        label: "Academic Info",
        path: "/manage/academic",
        loginRequired: true,
        icon: MenuBookRounded,
        color: "#FF5722",
      },
      {
        label: "Batch",
        path: "/manage/batch",
        loginRequired: true,
        icon: GroupsRounded,
        color: "#4DB6AC",
      },
      {
        label: "Lectures",
        path: "/manage/lectures",
        loginRequired: true,
        icon: PlayLessonRounded,
        color: "#42A5F5",
      },
      {
        label: "JEE Data",
        path: "/manage/jee-data",
        loginRequired: true,
        icon: TableChartRounded,
        color: "#FF7043",
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
    roles: [ROLES.ADMIN, ROLES.STUDENT],
  },
  {
    label: "Batch",
    path: "/batch",
    icon: GroupsRounded,
    type: "button",
    loginRequired: true,
    color: "#26A69A",
    roles: [ROLES.STUDENT],
  },
  {
    label: "Chat",
    path: "/chats",
    icon: ChatBubbleRounded,
    type: "button",
    loginRequired: true,
    color: "#142536",
    roles: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.STUDENT, ROLES.TEACHER],
  },
  {
    label: "Automation",
    icon: SettingsSuggestRounded,
    type: "menu",
    roles: [ROLES.ADMIN],
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
        label: "JDST Admit Card",
        path: "/automation/jdstadmitcard",
        icon: CreateRounded,
        loginRequired: false,
        color: "#1976D2",
      },
      {
        label: "Provisional Key",
        path: "/automation/jeemainprovisionalanswerkey",
        icon: GradingRounded,
        loginRequired: false,
        color: "#1976D2",
      },
      {
        label: "JEE Main Result",
        path: "/automation/jeemainresult",
        icon: AssignmentTurnedInRounded,
        loginRequired: false,
        color: "#a12374",
      },
    ],
  },
  {
    label: "Analysis",
    icon: InsightsRounded,
    path: "",
    loginRequired: false,
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
  {
    label: "Tools",
    icon: ComputerRounded,
    path: "",
    loginRequired: true,
    type: "menu",
    color: "#2514da",
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
    options: [
      {
        label: "Suffle JSON",
        path: "/tools/suffle-question",
        icon: ShuffleRounded,
        loginRequired: true,
        color: "#fa7485",
      },
    ],
  },
];
