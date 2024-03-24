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
        plugins: " image lists table wordcount",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough charmap | typography | lineheight | checklist numlist bullist indent outdent | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "kD",
        mergetags_list: [
          { value: "Kamdev", title: "Kamdev CHoudhary" },
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
