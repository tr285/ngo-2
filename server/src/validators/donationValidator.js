const { body } = require('express-validator');
const { PAYMENT_METHODS, DONATION_STATUS, PAYMENT_GATEWAYS } = require('../models/Donation');

const createManualDonationValidator = [
  body('donor').notEmpty().withMessage('Donor ID is required').isMongoId().withMessage('Invalid donor ID'),
  body('campaign').notEmpty().withMessage('Campaign ID is required').isMongoId().withMessage('Invalid campaign ID'),
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('currency').optional().trim().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required').isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
  body('transactionId').optional().trim(),
  body('status').optional().isIn(DONATION_STATUS).withMessage('Invalid status'),
  body('isAnonymous').optional().isBoolean(),
  body('notes').optional().trim(),
];

const initiateCheckoutValidator = [
  body('campaignId').notEmpty().withMessage('Campaign ID is required').isMongoId().withMessage('Invalid campaign ID'),
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('paymentGateway').notEmpty().withMessage('Payment gateway is required').isIn(['razorpay', 'stripe']).withMessage('Gateway must be razorpay or stripe'),
  body('isAnonymous').optional().isBoolean(),
];

const confirmPaymentValidator = [
  body('donationId').notEmpty().withMessage('Donation ID is required').isMongoId().withMessage('Invalid donation ID'),
];

const updateDonationValidator = [
  body('status').optional().isIn(DONATION_STATUS).withMessage('Invalid status'),
  body('notes').optional().trim(),
  body('transactionId').optional().trim(),
];

module.exports = {
  createManualDonationValidator,
  initiateCheckoutValidator,
  confirmPaymentValidator,
  updateDonationValidator,
};
