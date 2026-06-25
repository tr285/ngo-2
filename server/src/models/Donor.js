const mongoose = require('mongoose');

const DONOR_TYPES = ['individual', 'corporate'];
const DONOR_STATUS = ['active', 'inactive'];

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    donorType: {
      type: String,
      enum: DONOR_TYPES,
      default: 'individual',
    },
    organization: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    preferredCauses: [
      {
        type: String,
        trim: true,
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    taxId: {
      type: String,
      trim: true,
    },
    totalDonated: {
      type: Number,
      default: 0,
      min: 0,
    },
    donationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: DONOR_STATUS,
      default: 'active',
    },
    lastDonationAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

donorSchema.index({ status: 1 });
donorSchema.index({ donorType: 1 });
donorSchema.index({ totalDonated: -1 });

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
module.exports.DONOR_TYPES = DONOR_TYPES;
module.exports.DONOR_STATUS = DONOR_STATUS;
