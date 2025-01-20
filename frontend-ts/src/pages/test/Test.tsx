import React from "react";
import toastService from "../../utils/toastService";

const Test: React.FC = () => {
  const handleShowSuccess = () => {
    toastService({
      message: "This is a success notification!",
      type: "success",
    });
  };

  const handleShowError = () => {
    toastService({
      message: "Something went wrong!",
      type: "error",
      duration: 5000,
    });
  };

  return (
    <div>
      <button onClick={handleShowSuccess}>Show Success Toast</button>
      <button onClick={handleShowError}>Show Error Toast</button>
    </div>
  );
};

export default Test;
