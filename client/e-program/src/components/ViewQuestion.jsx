export default function ViewQuestion(props) {
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
              <option value="">-- Select Target --</option>
              <option value="IX">JEE</option>
              <option value="X">NEET</option>
            </select>
          </div>
        </div>

        <hr className="mt-2" />
      </div>
      {/* Single Correct */}
      <div className="col-12 mt-2 p-2 border rounded">
        <div className="mb-3 ">
          <p>Question</p>
          <textarea
            name="questionText"
            id="questionText mt-3"
            className="form-control mt-3"
            cols="10"
            value={props.currQuestion.questionText}
            rows="5"
            placeholder="Enter question"
            readOnly
            style={{ resize: "none" }}
          ></textarea>
        </div>
      </div>
      <p className="mt-2 ">Options</p>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="1"
            checked={props.currQuestion.correctAnswer === "1"}
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option1}
          placeholder="option 1"
          readOnly
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="2"
            checked={props.currQuestion.correctAnswer === "2"}
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option2}
          placeholder="option 2"
          readOnly
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="3"
            checked={props.currQuestion.correctAnswer === "3"}
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option3}
          placeholder="option 4"
          checked={props.currQuestion.correctAnswer === "4"}
          readOnly
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text bg-success text-light">
          <input
            className="form-check-input mt-0"
            type="radio"
            id="option1"
            name="correctAnswer"
            value="1"
            readOnly
          />
        </div>
        <input
          type="text"
          className="form-control"
          name="option1"
          value={props.currQuestion.option4}
          placeholder="option 2"
          readOnly
        />
      </div>
      <hr />
      <div className="col-12 mt-2 p-2 border rounded">
        <div className="mb-3 ">
          <p>Solution</p>
          <textarea
            name="questionText"
            id="questionText mt-3"
            className="form-control mt-3"
            cols="10"
            value={props.currQuestion.solution}
            rows="5"
            placeholder="Enter question"
          ></textarea>
        </div>
      </div>
    </>
  );
}
