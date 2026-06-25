const Beneficiary = require('../models/Beneficiary');
const AppError = require('../utils/AppError');
const { paginateQuery } = require('../utils/pagination');

const populateOptions = [
  { path: 'assignedVolunteer', populate: { path: 'user', select: 'firstName lastName email' } },
  { path: 'campaigns', select: 'title status' },
  { path: 'createdBy', select: 'firstName lastName email' },
];

const createBeneficiary = async (data, userId) => {
  const payload = { ...data, createdBy: userId };

  if (typeof payload.needs === 'string') {
    payload.needs = payload.needs.split(',').map((s) => s.trim()).filter(Boolean);
  }

  const beneficiary = await Beneficiary.create(payload);

  return Beneficiary.findById(beneficiary._id).populate(populateOptions);
};

const getAllBeneficiaries = async ({ page, limit, search, status, beneficiaryType }) => {
  const query = {};

  if (status) query.status = status;
  if (beneficiaryType) query.beneficiaryType = beneficiaryType;

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Beneficiary, {
    query,
    page,
    limit,
    populate: populateOptions,
  });

  return { beneficiaries: result.items, pagination: result.pagination };
};

const getBeneficiaryById = async (id) => {
  const beneficiary = await Beneficiary.findById(id).populate(populateOptions);

  if (!beneficiary) {
    throw new AppError('Beneficiary not found.', 404);
  }

  return beneficiary;
};

const updateBeneficiary = async (id, updates) => {
  const allowedFields = [
    'firstName',
    'lastName',
    'beneficiaryType',
    'description',
    'dateOfBirth',
    'gender',
    'contactInfo',
    'address',
    'needs',
    'status',
    'campaigns',
    'assignedVolunteer',
    'photos',
    'documents',
    'notes',
  ];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === 'needs' && typeof updates.needs === 'string') {
        filteredUpdates.needs = updates.needs.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        filteredUpdates[field] = updates[field];
      }
    }
  });

  const beneficiary = await Beneficiary.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!beneficiary) {
    throw new AppError('Beneficiary not found.', 404);
  }

  return beneficiary;
};

const deleteBeneficiary = async (id) => {
  const beneficiary = await Beneficiary.findByIdAndDelete(id);

  if (!beneficiary) {
    throw new AppError('Beneficiary not found.', 404);
  }

  return beneficiary;
};

module.exports = {
  createBeneficiary,
  getAllBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
};
