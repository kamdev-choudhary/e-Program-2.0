import React from "react";
import { icons } from "../constants/helper";

const createIcon = (src, dimension = 35) => (
  <img width={dimension} height={dimension} src={src} alt={"icon"} />
);

const pages = [
  {
    name: "Dashboard",
    path: "/dashboard",
    available: ["1", "2", "4", "3", "5"],
    icon: createIcon(icons.dashboard),
  },
  {
    name: "Admin",
    path: "/",
    available: ["1"],
    icon: createIcon(icons.admin),
    subMenu: true,
    subMenuItem: [
      {
        name: "Users",
        path: "/admin/users",
        available: ["0"],
        icon: createIcon(icons.users, 30),
      },
    ],
  },
  {
    name: "Articles",
    path: "/article",
    available: ["0"],
    icon: createIcon(icons.article),
  },
  {
    name: "Lectures",
    path: "/lectures",
    available: ["0"],
    icon: createIcon(icons.video),
  },
  {
    name: "Library",
    path: "/library",
    available: ["0"],
    icon: createIcon(icons.library),
  },
  {
    name: "Authentication",
    path: "",
    available: ["0"],
    icon: createIcon(icons.admin),
    subMenu: true,
    subMenuItem: [
      {
        name: "Login",
        path: "/login",
        available: ["0"],
        icon: createIcon(icons.login),
      },
      {
        name: "Sign Up",
        path: "/signup",
        available: ["0"],
        icon: createIcon(icons.login),
      },
    ],
  },
];

export { pages };
