const { body } = require('express-validator');
const { BENEFICIARY_TYPES, BENEFICIARY_STATUS, GENDER_OPTIONS } = require('../models/Beneficiary');

const createBeneficiaryValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').optional().trim(),
  body('beneficiaryType').optional().isIn(BENEFICIARY_TYPES).withMessage('Invalid beneficiary type'),
  body('description').optional().trim(),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('gender').optional().isIn(GENDER_OPTIONS).withMessage('Invalid gender option'),
  body('contactInfo').optional().isObject(),
  body('address').optional().isObject(),
  body('needs').optional(),
  body('status').optional().isIn(BENEFICIARY_STATUS).withMessage('Invalid status'),
  body('notes').optional().trim(),
];

const updateBeneficiaryValidator = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim(),
  body('beneficiaryType').optional().isIn(BENEFICIARY_TYPES).withMessage('Invalid beneficiary type'),
  body('description').optional().trim(),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('gender').optional().isIn(GENDER_OPTIONS).withMessage('Invalid gender option'),
  body('contactInfo').optional().isObject(),
  body('address').optional().isObject(),
  body('needs').optional(),
  body('status').optional().isIn(BENEFICIARY_STATUS).withMessage('Invalid status'),
  body('notes').optional().trim(),
];

module.exports = { createBeneficiaryValidator, updateBeneficiaryValidator };
