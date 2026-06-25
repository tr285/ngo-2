const { body } = require('express-validator');
const { EVENT_STATUS } = require('../models/Event');

const createEventValidator = [
  body('title').trim().notEmpty().withMessage('Event title is required').isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('location').optional().isObject(),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').notEmpty().withMessage('End date is required').isISO8601().withMessage('End date must be a valid date'),
  body('registrationDeadline').optional().isISO8601().withMessage('Registration deadline must be a valid date'),
  body('status').optional().isIn(EVENT_STATUS).withMessage('Invalid event status'),
  body('maxVolunteers').optional().isInt({ min: 1 }).withMessage('Max volunteers must be at least 1'),
  body('campaign').optional().isMongoId().withMessage('Invalid campaign ID'),
  body('requiredSkills').optional(),
  body('isPublic').optional().isBoolean(),
];

const updateEventValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 150 }),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('location').optional().isObject(),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('registrationDeadline').optional().isISO8601().withMessage('Registration deadline must be a valid date'),
  body('status').optional().isIn(EVENT_STATUS).withMessage('Invalid event status'),
  body('maxVolunteers').optional().isInt({ min: 1 }).withMessage('Max volunteers must be at least 1'),
  body('campaign').optional().isMongoId().withMessage('Invalid campaign ID'),
  body('requiredSkills').optional(),
  body('isPublic').optional().isBoolean(),
];

module.exports = { createEventValidator, updateEventValidator };
