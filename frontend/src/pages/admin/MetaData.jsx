import React, { useState } from "react";
import Class from "./academic/Class";
import Subjects from "./academic/Subjects";
import Exam from "./academic/Exam";
import ScrollableTabs from "../../components/ScrollableTabs";
import { icons } from "../../constants/helper";
import QuestionPatterns from "./academic/QuestionPatterns";

const tabs = [
  { name: "class", value: "class", icon: icons.class },
  { name: "subjects", value: "subjects", icon: icons.subjects },
  { name: "Exams", value: "exams", icon: icons.exam },
  { name: "Question Pattern", value: "pattern", icon: icons.pattern },
];

const componentMap = {
  class: <Class />,
  subjects: <Subjects />,
  exams: <Exam />,
  pattern: <QuestionPatterns />,
};

function MetaData() {
  const [selectedTab, setSelectedTab] = useState("class");
  return (
    <>
      <ScrollableTabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {componentMap[selectedTab]}
    </>
  );
}

export default MetaData;
