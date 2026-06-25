const mongoose = require('mongoose');

const PAYMENT_METHODS = ['cash', 'card', 'bank_transfer', 'upi', 'cheque', 'razorpay', 'stripe', 'other'];
const DONATION_STATUS = ['pending', 'completed', 'failed', 'refunded'];
const PAYMENT_GATEWAYS = ['razorpay', 'stripe', 'manual'];

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donor is required'],
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: [true, 'Payment method is required'],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentGateway: {
      type: String,
      enum: PAYMENT_GATEWAYS,
      default: 'manual',
    },
    gatewayOrderId: {
      type: String,
      trim: true,
    },
    gatewayPaymentId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: DONATION_STATUS,
      default: 'pending',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptUrl: {
      type: String,
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.pre('save', function generateReceiptNumber(next) {
  if (this.receiptNumber || this.status !== 'completed') {
    return next();
  }

  this.receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  next();
});

donationSchema.index({ donor: 1, donatedAt: -1 });
donationSchema.index({ campaign: 1, status: 1 });
donationSchema.index({ status: 1, donatedAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
module.exports.DONATION_STATUS = DONATION_STATUS;
module.exports.PAYMENT_GATEWAYS = PAYMENT_GATEWAYS;
