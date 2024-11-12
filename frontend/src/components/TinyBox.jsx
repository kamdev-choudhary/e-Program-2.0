import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../constants/helper";

const TinyBox = ({
  content,
  onContentChange,
  height = 200,
  readOnly = false,
}) => {
  return (
    <Editor
      apiKey={TINY_API_KEY}
      init={{
        height,
        readonly: readOnly,
        menubar: !readOnly,
        toolbar: readOnly
          ? false
          : "undo redo | blocks fontfamily fontsize | bold italic underline charmap | typography | lineheight | checklist numlist bullist indent outdent | removeformat",
        plugins: readOnly ? "" : "image lists table wordcount powerpaste",
        tinycomments_mode: !readOnly && "embedded",
        tinycomments_author: "Dakshana",
      }}
      value={content}
      onEditorChange={onContentChange}
    />
  );
};

export { TinyBox };
