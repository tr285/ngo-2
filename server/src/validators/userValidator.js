const { body } = require('express-validator');
const { ROLE_LIST } = require('../constants/roles');

const updateUserValidator = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty').isLength({ max: 50 }),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty').isLength({ max: 50 }),
  body('phone').optional().trim().isString(),
  body('role').optional().isIn(ROLE_LIST).withMessage('Invalid role'),
  body('isActive').optional().isBoolean(),
];

module.exports = { updateUserValidator };
