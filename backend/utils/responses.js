const generateResponse = (defaultMessage, statusCode) => {
  const responseFunction = (customMessage = defaultMessage) => ({
    message: customMessage,
    status_code: statusCode,
  });

  // Attach default properties to the function
  responseFunction.message = defaultMessage;
  responseFunction.status_code = statusCode;

  return responseFunction;
};

const response = {
  notFound: generateResponse("Record not found.", 0),
  success: generateResponse("Record Found.", 1),
  deleted: generateResponse("Deleted Successfully.", 2),
  edited: generateResponse("Edited Successfully.", 3),
  created: generateResponse("Data Saved Successfully.", 4),
  validation: generateResponse("Validation error", 5),
  error: generateResponse("Error", 0),
};

export default response;
