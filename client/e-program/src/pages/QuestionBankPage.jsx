import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./QuestionBankPage.css";
import SingleCorrectQuestion from "../components/SingleCorrectQuestion";
import MultiCorrectQuestion from "../components/MultiCorrectQuestion";
import IntegerType from "../components/IntegerType";

const API_URL = "http://127.0.0.1:5000/api";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [currClass, setCurrClass] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [searchQuestion, setSearchQuestion] = useState("");

  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState({
    SingleCorrect: false,
    MultiCorrect: false,
    Integer: false,
  });

  useEffect(() => {
    fetch(`${API_URL}/questionbank`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setQuestions(data.questions))
      .catch((error) => setError(error.message));
  }, []);

  const handleShowQuestionTypeModal = () => {
    setShowQuestionTypeModal(true);
  };

  const handleCloseQuestionTypeModal = () => {
    setShowQuestionTypeModal(false);
  };

  const handleAddQuestion = (e) => {
    const { name } = e.target;
    setShowQuestionModal({
      ...showQuestionModal,
      [name]: true,
    });
  };

  const handleCloseAddQuestion = (e) => {
    const { name } = e.target;
    setShowQuestionModal({
      ...showQuestionModal,
      [name]: false,
    });
  };
  function handleSearch(e) {
    setSearchQuestion(e.target.value);
    const filteredQuestions = questions.filter((question) => {
      return question.questionText === e.target.value;
    });
    // Now you can do something with the filtered questions if needed
    console.log("Filtered questions:", filteredQuestions);
  }

  const filteredQuestions = questions.filter((question) => {
    return (
      (currClass === "" || question.className === currClass) &&
      (subject === "" || question.subject === subject) &&
      (topic === "" || question.topic === topic) &&
      (subtopic === "" || question.subtopic === subtopic) &&
      (difficultyLevel === "" ||
        question.difficulty_level === difficultyLevel) &&
      (timeRequired === "" || question.time_required === timeRequired)
    );
  });

  return (
    <>
      <div className="row">
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Class
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select class --</option>
              <option value="IX">className - 09</option>
              <option value="X">className - 10</option>
            </select>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Subject
            </span>
            <select className="form-control">
              <option value="">-- Select Subject --</option>
              <option value="physics">PHYSICS</option>
              <option value="chemistry">CHEMISTRY</option>
              <option value="mathematics">MATHEMATICS</option>
              <option value="biology">BIOLOGY</option>
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
            <select className="form-control" name="question[className]">
              <option value="">-- Select Topic --</option>
              <option value="IX">Topic 1</option>
              <option value="X">Topic 2</option>
            </select>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Sub Topic
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select Subject --</option>
              <option value="IX">className - 09</option>
              <option value="X">className - 10</option>
            </select>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Difficulty Level
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select Subject --</option>
              <option value="IX">className - 09</option>
              <option value="X">className - 10</option>
            </select>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Time Required
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select Subject --</option>
              <option value="IX">className - 09</option>
              <option value="X">className - 10</option>
            </select>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Question Target
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select Subject --</option>
              <option value="IX">className - 09</option>
              <option value="X">className - 10</option>
            </select>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="input-group flex-nowrap rounded border border-success">
            <span
              className="input-group-text bg-success text-light"
              id="addon-wrapping"
            >
              Question Source
            </span>
            <select className="form-control" name="question[className]">
              <option value="">-- Select Subject --</option>
              <option value="IX">className - 09</option>
              <option value="X">className - 10</option>
            </select>
          </div>
        </div>
        <hr className="mt-2" />

        <div className="row justify-content-end">
          <div className="col-md-6 text-center">
            <div className="input-group flex-nowrap rounded border border-success">
              <span
                className="input-group-text bg-success text-light"
                id="addon-wrapping"
              >
                <b>Search</b> &nbsp; &nbsp;&nbsp;
                <i className="fa fa-search"></i>
              </span>
              <input
                className="form-control"
                type="text"
                onChange={handleSearch}
                name="search"
                value={searchQuestion}
              />
            </div>
          </div>
          <div className="col-md-4 text-center">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleShowQuestionTypeModal}
            >
              Add Question
            </button>
          </div>
        </div>

        <Modal
          show={showQuestionTypeModal}
          onHide={handleCloseQuestionTypeModal}
        >
          <Modal.Header>
            <Modal.Title>Add Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-grid gap-2">
              <button
                className="btn btn-success"
                type="button"
                name="SingleCorrect"
                onClick={handleAddQuestion}
              >
                Single Correct Question
              </button>
              <button
                className="btn btn-success"
                type="button"
                name="MultiCorrect"
                onClick={handleAddQuestion}
              >
                Multi Correct Question
              </button>
              <button
                className="btn btn-success"
                type="button"
                name="Integer"
                onClick={handleAddQuestion}
              >
                Integer Type Question
              </button>
              <button
                className="btn btn-success"
                type="button"
                name="MultiCorrect"
                onClick={handleAddQuestion}
              >
                Comprehensive Question
              </button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseQuestionTypeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showQuestionModal.SingleCorrect}
          onHide={handleCloseAddQuestion}
          dialogClassName="modal-xl"
        >
          <Modal.Header>
            <Modal.Title>Single Correct Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SingleCorrectQuestion />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              name="SingleCorrect"
              onClick={handleCloseAddQuestion}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showQuestionModal.MultiCorrect}
          onHide={handleCloseAddQuestion}
          dialogClassName="modal-xl"
        >
          <Modal.Header>
            <Modal.Title>Multi Correct Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MultiCorrectQuestion />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              name="MultiCorrect"
              onClick={handleCloseAddQuestion}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showQuestionModal.Integer}
          onHide={handleCloseAddQuestion}
          dialogClassName="modal-xl"
        >
          <Modal.Header>
            <Modal.Title>Integer Type Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <IntegerType />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              name="Integer"
              onClick={handleCloseAddQuestion}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <hr className="mt-2 mb-2" />
        <table className="table mt-2 border">
          <thead className="bg-success">
            <tr>
              <th scope="col" className="text-center">
                Select
              </th>
              <th scope="col" className="col-1 text-center">
                Q. id
              </th>
              <th scope="col" className="col-4">
                Question
              </th>
              <th scope="col" className="text-center">
                View
              </th>
              <th scope="col" className="text-center">
                Is Approved
              </th>
              <th scope="col" className="text-center">
                Subject
              </th>
              <th scope="col" className="text-center">
                Topic
              </th>
              <th scope="col" className="text-center">
                Class
              </th>
              <th scope="col" className="text-center">
                Difficulty Level
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>
                    <input type="Checkbox" />
                  </td>
                  <td className="text-center">{question.question_id}</td>
                  <td>{question.questionText}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-success">
                      View
                    </button>
                  </td>
                  <td className="text-center">{question.isApproved}</td>
                  <td className="text-center">{question.subject}</td>
                  <td className="text-center">{question.topic}</td>
                  <td className="text-center">{question.subtopic}</td>
                  <td className="text-center">{question.difficulty_level}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
