const AppError = require('../utils/AppError');
const env = require('../config/env');

const handleCastError = (error) =>
  new AppError(`Invalid ${error.path}: ${error.value}`, 400);

const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  return new AppError(`${field} "${value}" already exists.`, 409);
};

const handleValidationError = (error) => {
  const messages = Object.values(error.errors).map((err) => err.message);
  return new AppError(messages.join('. '), 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expired. Please log in again.', 401);

const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Internal Server Error';
  }

  if (error.name === 'CastError') {
    error = handleCastError(error);
  }

  if (error.code === 11000) {
    error = handleDuplicateKeyError(error);
  }

  if (error.name === 'ValidationError' && error.errors) {
    error = handleValidationError(error);
  }

  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: error.message,
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  if (env.isDevelopment && !error.isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
