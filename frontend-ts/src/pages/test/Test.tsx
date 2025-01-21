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

  const asbinary = BigInt(7279193285783441408).toString(2);
  const first41Char = asbinary.slice(0, 41);
  const timeStamp = parseInt(first41Char, 2);
  console.log(new Date(timeStamp));

  return (
    <div>
      <button onClick={handleShowSuccess}>Show Success Toast</button>
      <button onClick={handleShowError}>Show Error Toast</button>
    </div>
  );
};

export default Test;
