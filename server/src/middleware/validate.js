const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(new AppError('Validation failed', 400, formattedErrors));
  }

  next();
};

module.exports = validate;
