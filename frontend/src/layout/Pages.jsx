import React from "react";
import { icons } from "../constants/helper";

const createIcon = (src, dimension = 35) => (
  <img width={dimension} height={dimension} src={src} alt={"icon"} />
);

const pages = [
  {
    name: "Admin",
    path: "/admin",
    available: ["admin"],
    isLoginRequired: true,
    icon: createIcon(icons.admin),
    subMenu: true,
    subMenuItem: [
      {
        name: "Meta Data",
        path: "/admin/metadata",
        icon: createIcon(icons.info),
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: createIcon(icons.users, 30),
      },
      {
        name: "Lectures",
        path: "/admin/lectures",
        icon: createIcon(icons.video, 30),
      },
      {
        name: "Batches",
        path: "/admin/batches",
        icon: createIcon(icons.batches),
      },
    ],
  },
  {
    name: "Exams",
    path: "/exam",
    available: ["admin"],
    isLoginRequired: true,
    icon: createIcon(icons.exam),
    subMenu: true,
    subMenuItem: [
      {
        name: "Exam Master",
        path: "/admin/exam/master",
        icon: createIcon(icons.examMaster),
      },
      {
        name: "Online Exam",
        path: "/admin/exam/online",
        icon: createIcon(icons.onlineExam),
      },
      {
        name: "Offline Exam",
        path: "/admin/exam/offline",
        icon: createIcon(icons.offlineExam),
      },
    ],
  },
  {
    name: "Messages",
    path: "/message",
    isLoginRequired: false,
    available: ["0"],
    icon: createIcon(icons.chat),
  },
  {
    name: "Articles",
    path: "/article",
    isLoginRequired: false,
    available: ["0"],
    icon: createIcon(icons.article),
  },
  {
    name: "Lectures",
    path: "/lectures",
    isLoginRequired: false,
    available: ["0"],
    icon: createIcon(icons.video),
  },
  {
    name: "Library",
    path: "/library",
    isLoginRequired: false,
    available: ["0"],
    icon: createIcon(icons.library),
  },
  {
    name: "Question Bank",
    path: "/admin/question-bank",
    isLoginRequired: true,
    available: ["admin"],
    icon: createIcon(icons.questionBank),
  },
];

export { pages };
