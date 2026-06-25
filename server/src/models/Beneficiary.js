const mongoose = require('mongoose');

const BENEFICIARY_TYPES = ['individual', 'family', 'community'];
const BENEFICIARY_STATUS = ['active', 'inactive', 'graduated'];
const GENDER_OPTIONS = ['male', 'female', 'other', 'prefer_not_to_say'];

const beneficiarySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    beneficiaryType: {
      type: String,
      enum: BENEFICIARY_TYPES,
      default: 'individual',
    },
    description: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: GENDER_OPTIONS,
    },
    contactInfo: {
      phone: String,
      email: String,
      alternatePhone: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    needs: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: BENEFICIARY_STATUS,
      default: 'active',
    },
    enrolledDate: {
      type: Date,
      default: Date.now,
    },
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
      },
    ],
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
    },
    photos: [
      {
        type: String,
      },
    ],
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

beneficiarySchema.virtual('fullName').get(function fullName() {
  return [this.firstName, this.lastName].filter(Boolean).join(' ');
});

beneficiarySchema.index({ status: 1 });
beneficiarySchema.index({ beneficiaryType: 1 });
beneficiarySchema.index({ 'address.city': 1 });

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;
module.exports.BENEFICIARY_TYPES = BENEFICIARY_TYPES;
module.exports.BENEFICIARY_STATUS = BENEFICIARY_STATUS;
module.exports.GENDER_OPTIONS = GENDER_OPTIONS;
