import axios from "axios";
import React, { useEffect } from "react";

const Test: React.FC = () => {
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://admin.scholarship.dakshana.org/service/index.php/Question_paper/getAllQuestions",
        { caller_email: "dnayak@dakshana.org", id_question_paper_set: "1" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return <div>Test</div>;
};

export default Test;
