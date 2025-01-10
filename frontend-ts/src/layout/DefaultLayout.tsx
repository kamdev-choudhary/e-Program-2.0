import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DefaultLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
