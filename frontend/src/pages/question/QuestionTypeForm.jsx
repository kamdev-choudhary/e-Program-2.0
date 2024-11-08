import React from "react";
import SingleCorrectType from "./SingleCorrectType"; // Adjust the path as needed
import MultiCorrectType from "./MultiCorrectType"; // Adjust the path as needed

const QuestionTypeForm = ({
  type,
  subjects,
  selectedSubject,
  setSelectedSubject,
  subSubjects,
  selectedSubSubject,
  setSelectedSubSubject,
}) => {
  if (type === 1) {
    return (
      <SingleCorrectType
        subjects={subjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        subSubjects={subSubjects}
        selectedSubSubject={selectedSubSubject}
        setSelectedSubSubject={setSelectedSubSubject}
      />
    );
  }

  if (type === 2) {
    return (
      <MultiCorrectType
        subjects={subjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        subSubjects={subSubjects}
        selectedSubSubject={selectedSubSubject}
        setSelectedSubSubject={setSelectedSubSubject}
      />
    );
  }

  return null;
};

export default QuestionTypeForm;
