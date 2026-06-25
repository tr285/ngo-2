const { body } = require('express-validator');
const { CAMPAIGN_STATUS, CAMPAIGN_CATEGORIES } = require('../models/Campaign');

const createCampaignValidator = [
  body('title').trim().notEmpty().withMessage('Campaign title is required').isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description').trim().notEmpty().withMessage('Campaign description is required'),
  body('shortDescription').optional().trim().isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  body('category').optional().isIn(CAMPAIGN_CATEGORIES).withMessage('Invalid campaign category'),
  body('goalAmount').notEmpty().withMessage('Goal amount is required').isFloat({ min: 1 }).withMessage('Goal amount must be at least 1'),
  body('currency').optional().trim().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').notEmpty().withMessage('End date is required').isISO8601().withMessage('End date must be a valid date'),
  body('status').optional().isIn(CAMPAIGN_STATUS).withMessage('Invalid campaign status'),
  body('isFeatured').optional().isBoolean(),
];

const updateCampaignValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 150 }),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().trim().isLength({ max: 300 }),
  body('category').optional().isIn(CAMPAIGN_CATEGORIES).withMessage('Invalid campaign category'),
  body('goalAmount').optional().isFloat({ min: 1 }).withMessage('Goal amount must be at least 1'),
  body('raisedAmount').optional().isFloat({ min: 0 }).withMessage('Raised amount cannot be negative'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('status').optional().isIn(CAMPAIGN_STATUS).withMessage('Invalid campaign status'),
  body('isFeatured').optional().isBoolean(),
];

module.exports = { createCampaignValidator, updateCampaignValidator };
