const mongoose = require('mongoose');

const CAMPAIGN_STATUS = ['draft', 'active', 'paused', 'completed', 'cancelled'];
const CAMPAIGN_CATEGORIES = [
  'education',
  'healthcare',
  'environment',
  'disaster_relief',
  'community',
  'other',
];

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      enum: CAMPAIGN_CATEGORIES,
      default: 'other',
    },
    goalAmount: {
      type: Number,
      required: [true, 'Goal amount is required'],
      min: [1, 'Goal amount must be at least 1'],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: CAMPAIGN_STATUS,
      default: 'draft',
    },
    coverImage: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    beneficiaries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    donorCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.virtual('progressPercent').get(function progressPercent() {
  if (!this.goalAmount) return 0;
  return Math.min(Math.round((this.raisedAmount / this.goalAmount) * 100), 100);
});

campaignSchema.pre('save', function generateSlug(next) {
  if (!this.isModified('title') && this.slug) {
    return next();
  }

  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  next();
});

campaignSchema.index({ status: 1, startDate: -1 });
campaignSchema.index({ category: 1 });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
module.exports.CAMPAIGN_STATUS = CAMPAIGN_STATUS;
module.exports.CAMPAIGN_CATEGORIES = CAMPAIGN_CATEGORIES;
