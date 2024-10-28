// responses.js
const response = {
  notFound: {
    message: "Record not found.",
    status_code: 0,
  },
  success: {
    message: "Record Found.",
    status_code: 1,
  },
  deleted: {
    message: "Deleted Successfully.",
    status_code: 2,
  },
  edited: {
    message: "Edited Successfully.",
    status_code: 3,
  },
  created: {
    message: "Data Saved Successfully",
    status_code: 4,
  },
  validation: {
    message: "Validation Error",
    status_code: 5,
  },
};

module.exports = response;
