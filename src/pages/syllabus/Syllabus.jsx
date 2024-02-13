import React, { useState, useEffect } from "react";
import SyllabusTable from "../../components/SyllabusTable";
const API_URL = "http://127.0.0.1:8080/syllabus";
const Syllabus = () => {
  const [syllabuses, setSyllabuses] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setSyllabuses(data.syllabuses))
      .catch((error) => console.error("Error fetching lectures:", error));
  }, []);

  return (
    <div>
      <SyllabusTable syllabuses={syllabuses} />
    </div>
  );
};

export default Syllabus;
