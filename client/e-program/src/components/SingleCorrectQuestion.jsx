import { useState } from "react";

export default function SingleCorrectQuestion() {
  const [questionData, setQuestionData] = useState({
    classes: "",

    subject: "",
    topic: "",
    subtopic: "",
    questionType: "singleCorrect",
    isApproved: "No",
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    solution: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("QUestion data:", questionData);
  };

  return (
    <>
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
          <div className="mb-3">
            <textarea
              name="questionText"
              value={questionData.questionText}
              onChange={handleInputChange}
              id="questionText mt-3"
              className="form-control mt-3"
              cols="30"
              rows="10"
              placeholder="Enter question"
              required
            ></textarea>
            <div className="invalid-feedback">Please add a question</div>
          </div>
          <h4 className="text-center mt-2 ">Options</h4>
          <div className="input-group mb-3">
            <div className="input-group-text bg-success text-light">
              <input
                className="form-check-input mt-0"
                type="radio"
                id="option1"
                name="correctAnswer"
                value="1"
                checked={questionData.correctAnswer === "1"}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="text"
              className="form-control"
              name="option1"
              value={questionData.option1}
              onChange={handleInputChange}
              placeholder="option 1"
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-text bg-success text-light">
              <input
                className="form-check-input mt-0"
                type="radio"
                id="option2"
                name="correctAnswer"
                value="2"
                checked={questionData.correctAnswer === "2"}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="text"
              className="form-control"
              name="option2"
              value={questionData.option2}
              onChange={handleInputChange}
              placeholder="option 2"
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-text bg-success text-light">
              <input
                className="form-check-input mt-0"
                type="radio"
                id="option3"
                name="correctAnswer"
                value="3"
                checked={questionData.correctAnswer === "3"}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="text"
              className="form-control"
              name="option3"
              value={questionData.option3}
              onChange={handleInputChange}
              placeholder="option 3"
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-text bg-success text-light">
              <input
                className="form-check-input mt-0"
                type="radio"
                id="option4"
                name="correctAnswer"
                value="4"
                checked={questionData.correctAnswer === "4"}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="text"
              className="form-control"
              name="option4"
              value={questionData.option4}
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
              aria-label="With textarea"
              name="solution"
              value={questionData.solution}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="text-center m-2 ">
            <button className="btn btn-success ">Save</button>
          </div>
        </div>
      </form>
    </>
  );
}
