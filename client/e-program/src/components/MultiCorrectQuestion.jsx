import React, { useState } from "react";
import { TinyBox } from "./TinyBox";

export default function MultiCorrectQuestion() {
  const [questionData, setQuestionData] = useState({
    subject: "",
    topic: "",
    subtopic: "",
    questionType: "MultiCorrect",
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    solution: "",
    correctAnswers: [],
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "correctAnswer") {
      const updatedCorrectAnswers = [...questionData.correctAnswers];
      const optionNumber = value;

      if (checked) {
        updatedCorrectAnswers.push(optionNumber);
      } else {
        const indexToRemove = updatedCorrectAnswers.indexOf(optionNumber);
        if (indexToRemove !== -1) {
          updatedCorrectAnswers.splice(indexToRemove, 1);
        }
      }

      setQuestionData({
        ...questionData,
        correctAnswers: updatedCorrectAnswers,
      });
    } else {
      setQuestionData({
        ...questionData,
        [name]: value,
      });
    }
  };

  const handleTinyBoxChange = (content) => {
    setQuestionData({
      ...questionData,
      questionText: content,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Question data:", questionData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="needs-validation">
      <div className="container mt-2 border rounded">
        <div className="row mt-2">
          <div className="col-md-4 mb-2">
            <div className="input-group flex-nowrap rounded border border-success">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Subject
              </span>
              <select
                className="form-control"
                name="subject"
                value={questionData.subject}
                onChange={handleInputChange}
              >
                <option value="">-- Select Class --</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
                <option value="biology">Biology</option>
              </select>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="input-group flex-nowrap rounded border border-success">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Topic
              </span>
              <select
                className="form-control"
                name="topic"
                value={questionData.topic}
                onChange={handleInputChange}
              >
                <option value="">-- Select Topic --</option>
                <option value="topic 1">Topic 1</option>
                <option value="topic 2">Topic 2</option>
                <option value="topic 3">Topic 3</option>
                <option value="topic 4">Topic 4</option>
                <option value="topic 5">Topic 5</option>
              </select>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="input-group flex-nowrap rounded border border-success">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                Sub-topic
              </span>
              <select
                className="form-control"
                name="subtopic"
                value={questionData.subtopic}
                onChange={handleInputChange}
              >
                <option value="">-- Select Topic --</option>
                <option value="subtopic 1">Subtopic 1</option>
                <option value="subtopic 2">subtopic 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 mt-2 p-2 border rounded">
        <div className="col-md-12 mb-2">
          <TinyBox setTinyBoxValue={handleTinyBoxChange} />
        </div>
        <p>Options</p>
        <div className="input-group mb-3">
          <div className="input-group-text bg-success text-light">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="options1"
              name="correctAnswer"
              value="1"
              checked={questionData.correctAnswers.includes("1")}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="text"
            className="form-control"
            name="option1"
            value={questionData.option1.value}
            onChange={handleInputChange}
            placeholder="option 1"
            required
          />
        </div>
        <div className="input-group mb-3 rounded">
          <div className="input-group-text bg-success text-light">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="options2"
              name="correctAnswer"
              value="2"
              checked={questionData.correctAnswers.includes("2")}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="text"
            className="form-control"
            name="option2"
            id="option2"
            value={questionData.option2.value}
            onChange={handleInputChange}
            placeholder="option 2"
            required
          />
        </div>
        <div className="input-group mb-3 rounded">
          <div className="input-group-text bg-success text-light">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="options3"
              name="correctAnswer"
              value="3"
              checked={questionData.correctAnswers.includes("3")}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="text"
            className="form-control"
            name="option3"
            id="option3"
            value={questionData.option3.value}
            onChange={handleInputChange}
            placeholder="option 3"
            required
          />
        </div>
        <div className="input-group mb-3 rounded">
          <div className="input-group-text bg-success text-light">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="options4"
              name="correctAnswer"
              value="4"
              checked={questionData.correctAnswers.includes("4")}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="text"
            className="form-control"
            name="option4"
            id="option4"
            value={questionData.option4.value}
            onChange={handleInputChange}
            placeholder="option 4"
            required
          />
        </div>

        <hr />
        <div className="input-group">
          <span className="input-group-text bg-success text-light">
            Solution
          </span>
          <textarea
            className="form-control"
            rows="1"
            aria-label="Solution"
            value={questionData.solution}
            onChange={(e) =>
              setQuestionData({ ...questionData, solution: e.target.value })
            }
            required
          ></textarea>
        </div>
        <div className="col-md-12 text-center">
          <button type="submit" className="btn btn-success  mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
