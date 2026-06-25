const Campaign = require('../models/Campaign');
const AppError = require('../utils/AppError');
const { paginateQuery } = require('../utils/pagination');

const populateOptions = [
  { path: 'createdBy', select: 'firstName lastName email' },
  { path: 'beneficiaries', select: 'firstName lastName status beneficiaryType' },
];

const createCampaign = async (data, userId) => {
  const campaign = await Campaign.create({
    ...data,
    createdBy: userId,
  });

  return Campaign.findById(campaign._id).populate(populateOptions);
};

const getAllCampaigns = async ({ page, limit, search, status, category }) => {
  const query = {};

  if (status) query.status = status;
  if (category) query.category = category;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Campaign, {
    query,
    page,
    limit,
    populate: populateOptions,
    sort: { startDate: -1 },
  });

  return { campaigns: result.items, pagination: result.pagination };
};

const getCampaignById = async (id) => {
  const campaign = await Campaign.findById(id).populate(populateOptions);

  if (!campaign) {
    throw new AppError('Campaign not found.', 404);
  }

  return campaign;
};

const updateCampaign = async (id, updates) => {
  const allowedFields = [
    'title',
    'description',
    'shortDescription',
    'category',
    'goalAmount',
    'raisedAmount',
    'currency',
    'startDate',
    'endDate',
    'status',
    'coverImage',
    'images',
    'beneficiaries',
    'isFeatured',
  ];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const campaign = await Campaign.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!campaign) {
    throw new AppError('Campaign not found.', 404);
  }

  return campaign;
};

const deleteCampaign = async (id) => {
  const campaign = await Campaign.findByIdAndDelete(id);

  if (!campaign) {
    throw new AppError('Campaign not found.', 404);
  }

  return campaign;
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
