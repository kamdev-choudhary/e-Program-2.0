import React, { useState } from "react";

const FileToBase64Converter = () => {
  const [base64String, setBase64String] = useState("");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // When the file is read successfully, the result will be available in reader.result
        const base64Result = reader.result;
        setBase64String(base64Result);
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };
  console.log(base64String);

  return (
    <div>
      <input type="file" onChange={handleFileInputChange} />
      <div>
        {base64String && <img src={base64String} alt="Uploaded File" />}
      </div>
    </div>
  );
};

export default FileToBase64Converter;
