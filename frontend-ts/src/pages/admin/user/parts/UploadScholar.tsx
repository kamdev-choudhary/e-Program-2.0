import React from "react";
import FileDropZone from "../../../../components/FileDropZone";

const UploadScholar: React.FC = () => {
  const onDrop = () => {};
  return (
    <>
      <FileDropZone acceptedExtensions={[".xlsx"]} onDrop={onDrop} />
    </>
  );
};

export default UploadScholar;
