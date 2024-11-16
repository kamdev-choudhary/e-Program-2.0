import React from "react";
import { useLocation } from "react-router-dom";

function BookOpen() {
  const location = useLocation();
  const bookId = location.pathname.split("/")[3]; // Assumes /books/:bookId
  const { fileLink } = location.state || [];

  return (
    <div>
      <h1>BookOpen</h1>
      <p>Book ID: {bookId}</p>
      <p>Book link: {fileLink}</p>
      <iframe src={fileLink} frameborder="0"></iframe>
    </div>
  );
}

export default BookOpen;
