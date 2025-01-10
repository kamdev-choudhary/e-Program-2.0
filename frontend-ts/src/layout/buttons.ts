import {
  HomeRounded,
  LibraryBooksRounded,
  LocationCityRounded,
  SchoolRounded,
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
    path: "/lectures",
    icon: SchoolRounded,
    color: "#28844f",
    type: "button",
    size: 20,
  },
  {
    label: "Books",
    path: "/books",
    icon: LibraryBooksRounded,
    type: "button",
    color: "#28844f",
    size: 20,
  },
  {
    label: "CITY Info",
    path: "/automation/jee/cityinfo",
    icon: LocationCityRounded,
    type: "button",
    color: "#fff",
    size: 20,
  },
];
