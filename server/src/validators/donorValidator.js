const { body } = require('express-validator');
const { DONOR_TYPES, DONOR_STATUS } = require('../models/Donor');

const createDonorValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().trim().isString(),
  body('donorType').optional().isIn(DONOR_TYPES).withMessage('Donor type must be individual or corporate'),
  body('organization').optional().trim(),
  body('taxId').optional().trim(),
  body('isAnonymous').optional().isBoolean(),
  body('status').optional().isIn(DONOR_STATUS).withMessage('Invalid status'),
  body('notes').optional().trim(),
];

const updateDonorValidator = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty').isLength({ max: 50 }),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty').isLength({ max: 50 }),
  body('phone').optional().trim().isString(),
  body('donorType').optional().isIn(DONOR_TYPES).withMessage('Donor type must be individual or corporate'),
  body('organization').optional().trim(),
  body('taxId').optional().trim(),
  body('isAnonymous').optional().isBoolean(),
  body('status').optional().isIn(DONOR_STATUS).withMessage('Invalid status'),
  body('notes').optional().trim(),
];

module.exports = { createDonorValidator, updateDonorValidator };
