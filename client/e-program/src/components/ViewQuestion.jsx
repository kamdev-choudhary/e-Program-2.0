export default function ViewQuestion(props) {
  return (
    <>
      <div className="col-12 mt-2 p-2 border rounded">
        <div className="mb-3">
          <p>Question</p>
          <textarea
            name="questionText"
            id="questionText mt-3"
            className="form-control mt-3"
            cols="10"
            value={props.currQuestion.questionText}
            rows="5"
            placeholder="Enter question"
            required
          ></textarea>
          <div className="invalid-feedback">Please add a question</div>
        </div>
      </div>
      <p>Options</p>
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
    </>
  );
}
