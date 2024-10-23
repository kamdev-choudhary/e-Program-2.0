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
    subMenuItem: [],
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
    name: "Login",
    path: "/login",
    available: ["0"],
    icon: createIcon(icons.login),
  },
];

export { pages };
