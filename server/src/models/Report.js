const mongoose = require('mongoose');

const REPORT_TYPES = [
  'donation',
  'volunteer',
  'campaign',
  'beneficiary',
  'financial',
  'event',
  'custom',
];

const REPORT_STATUS = ['draft', 'generated', 'published', 'archived'];
const REPORT_FORMATS = ['json', 'pdf', 'csv', 'xlsx'];

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    reportType: {
      type: String,
      enum: REPORT_TYPES,
      required: [true, 'Report type is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    period: {
      startDate: {
        type: Date,
        required: [true, 'Period start date is required'],
      },
      endDate: {
        type: Date,
        required: [true, 'Period end date is required'],
      },
    },
    filters: {
      campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
      },
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
      },
      volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
      },
      status: String,
      category: String,
    },
    summary: {
      totalRecords: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      highlights: [String],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    format: {
      type: String,
      enum: REPORT_FORMATS,
      default: 'json',
    },
    fileUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: REPORT_STATUS,
      default: 'draft',
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Report generator is required'],
    },
    generatedAt: {
      type: Date,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ reportType: 1, status: 1 });
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
module.exports.REPORT_TYPES = REPORT_TYPES;
module.exports.REPORT_STATUS = REPORT_STATUS;
module.exports.REPORT_FORMATS = REPORT_FORMATS;
