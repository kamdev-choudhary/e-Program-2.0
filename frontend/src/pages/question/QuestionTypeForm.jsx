import React from "react";
import SingleCorrectType from "./SingleCorrectType"; // Adjust the path as needed
import MultiCorrectType from "./MultiCorrectType"; // Adjust the path as needed

const QuestionTypeForm = ({
  type,
  subjects,
  filteredSubSubjects,
  filteredTopics,
  filteredSubTopics,
  selectedSubject,
  setSelectedSubject,
  selectedSubSubject,
  setSelectedSubSubject,
  selectedTopic,
  setSelectedTopic,
  selectedSubTopic,
  setSelectedSubTopic,
  classes,
  selectedClass,
  setSelectedClass,
}) => {
  const commonProps = {
    subjects,
    filteredSubSubjects,
    filteredTopics,
    filteredSubTopics,
    selectedSubject,
    setSelectedSubject,
    selectedSubSubject,
    setSelectedSubSubject,
    selectedTopic,
    setSelectedTopic,
    selectedSubTopic,
    setSelectedSubTopic,
    classes,
    selectedClass,
    setSelectedClass,
  };

  if (type === 1) {
    return <SingleCorrectType {...commonProps} />;
  }

  if (type === 2) {
    return <MultiCorrectType {...commonProps} />;
  }

  return null;
};

export default QuestionTypeForm;
