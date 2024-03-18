import { useState } from "react";

export default function InputBox() {
  const [text, setText] = useState("<p>This is Examle Text</p>");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  function removeTags(str) {
    return str.replace(/<[^>]*>/g, "");
  }
  const stringWithoutTags = removeTags(text);
  console.log(stringWithoutTags);
  console.log(text);

  const handleBoldClick = () => {
    if (selectionStart === selectionEnd) return;

    const selectedText = text.substring(selectionStart, selectionEnd);
    const newText =
      text.slice(0, selectionStart) +
      `<strong>${selectedText}</strong>` +
      text.slice(selectionEnd);

    setText(newText);
  };

  const handleTextareaChange = (event) => {
    setText(event.target.value);
    console.log(event.target);
  };

  const handleTextareaSelect = (event) => {
    setSelectionStart(event.target.selectionStart);
    setSelectionEnd(event.target.selectionEnd);
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12 border rounded p-2">
          <div className="menubar ">
            <button className="btn">Menu</button>
            <button className="btn">Edit</button>
            <button className="btn">View</button>
            <button className="btn">Insert</button>
            <button className="btn">Format</button>
            <button className="btn">Tools</button>
            <button className="btn">Tables</button>
          </div>
          <div className="col-md-12 p-3">
            <div className="row">
              <div className="col-1">
                <button className="btn">
                  <i className="fa-solid fa-arrow-rotate-left"></i>
                </button>
                <button className="btn">
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </button>
              </div>
              <div className="col-2">
                <select
                  name="paragraph"
                  id="paragraph"
                  className="form-select col-2"
                >
                  <option value="Calibri">Paragraph</option>
                </select>
              </div>
              <div className="col-2">
                <select name="font" id="font" className="form-select col-2">
                  <option value="Calibri">Calibri</option>
                </select>
              </div>
              <div className="col-1">
                <select
                  name="font-size"
                  id="font-size"
                  className="form-select col-2"
                >
                  <option value="8">8 pt</option>
                  <option value="10">10 pt</option>
                  <option value="12">12 pt</option>
                  <option value="14">14 pt</option>
                  <option value="18">18 pt</option>
                  <option value="24">24 pt</option>
                  <option value="36">36 pt</option>
                  <option value="72">72 pt</option>
                </select>
              </div>
              <div className="col-2">
                <button className="btn" onClick={handleBoldClick}>
                  <i className="fa-solid fa-bold"></i>
                </button>
                <button className="btn" onClick={() => execCmd("italic")}>
                  <i className="fa-solid fa-italic"></i>
                </button>
                <button className="btn" onClick={() => execCmd("underline")}>
                  <i className="fa-solid fa-underline"></i>
                </button>
                <button
                  className="btn"
                  onClick={() => execCmd("strikeThrough")}
                >
                  <i className="fa-solid fa-strikethrough"></i>
                </button>
              </div>
              <div className="col-1">Ω</div>
            </div>
          </div>
          <div className="text-input">
            <textarea
              name=""
              id=""
              value={stringWithoutTags}
              cols="30"
              rows="10"
              onChange={handleTextareaChange}
              onSelect={handleTextareaSelect}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}
