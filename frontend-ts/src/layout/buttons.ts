import {
  HomeRounded,
  LibraryBooksRounded,
  SchoolRounded,
  SchoolTwoTone,
} from "@mui/icons-material";
import React from "react";

interface Option {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface Button {
  label: string;
  path?: string;
  icon: React.ElementType;
  type: "button" | "menu";
  options?: Option[];
  color: string;
  size: number;
}

export const buttons: Button[] = [
  {
    label: "Home",
    path: "/",
    icon: HomeRounded,
    color: "#28844f",
    type: "button",
    size: 20,
  },
  {
    label: "Lectures",
    path: "",
    icon: SchoolRounded,
    color: "#28844f",
    type: "menu",
    size: 20,
    options: [
      {
        label: "Class 10",
        path: "/lecture/10",
        icon: SchoolTwoTone,
      },
      {
        label: "Class 12",
        path: "/lecture/12",
        icon: SchoolTwoTone,
      },
    ],
  },
  {
    label: "Books",
    path: "/books",
    icon: LibraryBooksRounded,
    type: "button",
    color: "#28844f",
    size: 20,
  },
];
