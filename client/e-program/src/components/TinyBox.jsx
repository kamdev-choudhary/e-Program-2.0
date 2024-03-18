import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyBox({ setTinyBoxValue, name }) {
  const handleTinyBoxChange = (content) => {
    setTinyBoxValue(content);
  };

  return (
    <Editor
      apiKey="o9adc3d0e8icjmn90btn0tfps73vsqpqqry3xb7do5xyqnxm"
      init={{
        plugins:
          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough charmap | typography | lineheight | checklist numlist bullist indent outdent | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          { value: "First.Name", title: "First Name" },
          { value: "Email", title: "Email" },
        ],
        ai_request: (request, respondWith) =>
          respondWith.string(() =>
            Promise.reject("See docs to implement AI Assistant")
          ),
      }}
      name={name}
      onEditorChange={handleTinyBoxChange}
    />
  );
}
