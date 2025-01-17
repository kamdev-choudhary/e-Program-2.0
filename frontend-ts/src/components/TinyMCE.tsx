import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../config/environment";

// Define a reusable TinyMCEEditor component
interface TinyMCEEditorProps {
  initialValue: string;
  height?: number;
  onChange?: (content: string) => void;
  tinymceScriptSrc?: string;
  readonly?: boolean; // Add readonly prop
}

export default function TinyMCEEditor({
  initialValue,
  height = 500,
  onChange,
  tinymceScriptSrc = "/tinymce/tinymce.min.js",
  readonly = false, // Default to false (editable)
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  // Handle editor change (if needed)
  const handleEditorChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      tinymceScriptSrc={tinymceScriptSrc}
      licenseKey={TINY_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "preview",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        disabled: readonly, // Apply the readonly prop to the TinyMCE editor
      }}
      onEditorChange={handleEditorChange}
    />
  );
}
