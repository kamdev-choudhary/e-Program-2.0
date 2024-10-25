import React from "react";
import { icons } from "../constants/helper";

const createIcon = (src, dimension = 35) => (
  <img width={dimension} height={dimension} src={src} alt={"icon"} />
);

const pages = [
  {
    name: "Home",
    path: "/",
    isLoginRequired: false,
    available: ["admin"],
    icon: createIcon(icons.dashboard),
  },
  {
    name: "Admin",
    path: "/admin",
    available: ["admin"],
    isLoginRequired: true,
    icon: createIcon(icons.admin),
    subMenu: true,
    subMenuItem: [
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
    ],
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
];

export { pages };
