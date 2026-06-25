const mongoose = require('mongoose');

const EVENT_STATUS = ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'];
const VOLUNTEER_REGISTRATION_STATUS = ['registered', 'confirmed', 'attended', 'cancelled'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    location: {
      venue: String,
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: EVENT_STATUS,
      default: 'draft',
    },
    maxVolunteers: {
      type: Number,
      min: 1,
    },
    volunteers: [
      {
        volunteer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Volunteer',
          required: true,
        },
        status: {
          type: String,
          enum: VOLUNTEER_REGISTRATION_STATUS,
          default: 'registered',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        hoursContributed: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer is required'],
    },
    coverImage: {
      type: String,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.virtual('registeredCount').get(function registeredCount() {
  return this.volunteers.filter((entry) => entry.status !== 'cancelled').length;
});

eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ campaign: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
module.exports.EVENT_STATUS = EVENT_STATUS;
module.exports.VOLUNTEER_REGISTRATION_STATUS = VOLUNTEER_REGISTRATION_STATUS;
