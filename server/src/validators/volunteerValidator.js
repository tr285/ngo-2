const { body } = require('express-validator');
const { VOLUNTEER_STATUS } = require('../models/Volunteer');

const createVolunteerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().trim().isString(),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters'),
  body('skills').optional(),
  body('availability').optional().trim(),
  body('status').optional().isIn(VOLUNTEER_STATUS).withMessage('Invalid status'),
  body('totalHours').optional().isFloat({ min: 0 }).withMessage('Total hours must be a non-negative number'),
  body('notes').optional().trim(),
];

const updateVolunteerValidator = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty').isLength({ max: 50 }),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty').isLength({ max: 50 }),
  body('phone').optional().trim().isString(),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters'),
  body('skills').optional(),
  body('availability').optional().trim(),
  body('status').optional().isIn(VOLUNTEER_STATUS).withMessage('Invalid status'),
  body('totalHours').optional().isFloat({ min: 0 }).withMessage('Total hours must be a non-negative number'),
  body('notes').optional().trim(),
];

module.exports = { createVolunteerValidator, updateVolunteerValidator };
