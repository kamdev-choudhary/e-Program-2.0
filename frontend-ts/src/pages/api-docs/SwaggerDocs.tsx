import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerDocs: React.FC = () => {
  // Replace with your backend API docs URL
  const apiDocsUrl = "http://localhost:5000/api-docs";

  return (
    <div className="swagger-container">
      <h1>API Documentation</h1>
      <SwaggerUI url={apiDocsUrl} />
    </div>
  );
};

export default SwaggerDocs;
