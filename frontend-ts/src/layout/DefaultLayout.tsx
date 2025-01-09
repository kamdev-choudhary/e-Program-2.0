import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";

const DefaultLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Body />
    </div>
  );
};

export default DefaultLayout;
