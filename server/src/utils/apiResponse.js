const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    ...data,
  });
};

const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  sendResponse(res, statusCode, { message, ...data });
};

const sendError = (res, message, statusCode = 500, errors = null) => {
  const payload = { message };

  if (errors) {
    payload.errors = errors;
  }

  sendResponse(res, statusCode, payload);
};

module.exports = { sendResponse, sendSuccess, sendError };
