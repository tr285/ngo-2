const mongoose = require('mongoose');

const VOLUNTEER_STATUS = ['pending', 'approved', 'active', 'inactive', 'rejected'];

const volunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: {
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
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    dateOfBirth: {
      type: Date,
    },
    status: {
      type: String,
      enum: VOLUNTEER_STATUS,
      default: 'pending',
    },
    totalHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
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

volunteerSchema.index({ status: 1 });
volunteerSchema.index({ skills: 1 });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
module.exports.VOLUNTEER_STATUS = VOLUNTEER_STATUS;
