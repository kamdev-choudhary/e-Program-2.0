import React, { useState, useEffect } from "react";
import LectureTable from "../../components/LectureTable";

const API_URL = "http://127.0.0.1:5000/api";

const Lectures = () => {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/lectures`)
      .then((response) => response.json())
      .then((data) => setLectures(data.lectures))
      .catch((error) => console.error("Error fetching lectures:", error));
  }, []);

  console.log(event);

  return (
    <div>
      <LectureTable lectures={lectures} />
    </div>
  );
};

export default Lectures;
