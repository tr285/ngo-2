const User = require('../models/User');
const Donor = require('../models/Donor');
const AppError = require('../utils/AppError');
const { ROLES } = require('../constants/roles');
const { paginateQuery } = require('../utils/pagination');

const populateOptions = [
  { path: 'user', select: 'firstName lastName email phone isActive' },
];

const createDonor = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    donorType,
    organization,
    address,
    preferredCauses,
    isAnonymous,
    taxId,
    status,
    notes,
  } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already registered.', 409);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: password || 'Donor@123',
    role: ROLES.DONOR,
    phone,
  });

  const donor = await Donor.create({
    user: user._id,
    donorType: donorType || 'individual',
    organization,
    address,
    preferredCauses: Array.isArray(preferredCauses)
      ? preferredCauses
      : preferredCauses
        ? preferredCauses.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    isAnonymous: isAnonymous || false,
    taxId,
    status: status || 'active',
    notes,
  });

  return Donor.findById(donor._id).populate(populateOptions);
};

const getAllDonors = async ({ page, limit, search, status, donorType }) => {
  const query = {};

  if (status) query.status = status;
  if (donorType) query.donorType = donorType;

  if (search) {
    const users = await User.find({
      role: ROLES.DONOR,
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    query.$or = [
      { user: { $in: users.map((u) => u._id) } },
      { organization: { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Donor, {
    query,
    page,
    limit,
    populate: populateOptions,
    sort: { totalDonated: -1 },
  });

  return { donors: result.items, pagination: result.pagination };
};

const getDonorById = async (id) => {
  const donor = await Donor.findById(id).populate(populateOptions);

  if (!donor) {
    throw new AppError('Donor not found.', 404);
  }

  return donor;
};

const updateDonor = async (id, updates) => {
  const allowedFields = [
    'donorType',
    'organization',
    'address',
    'preferredCauses',
    'isAnonymous',
    'taxId',
    'status',
    'notes',
  ];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === 'preferredCauses' && typeof updates.preferredCauses === 'string') {
        filteredUpdates.preferredCauses = updates.preferredCauses
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        filteredUpdates[field] = updates[field];
      }
    }
  });

  const donor = await Donor.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!donor) {
    throw new AppError('Donor not found.', 404);
  }

  if (updates.firstName || updates.lastName || updates.phone || updates.isActive !== undefined) {
    const userUpdates = {};
    if (updates.firstName !== undefined) userUpdates.firstName = updates.firstName;
    if (updates.lastName !== undefined) userUpdates.lastName = updates.lastName;
    if (updates.phone !== undefined) userUpdates.phone = updates.phone;
    if (updates.isActive !== undefined) userUpdates.isActive = updates.isActive;

    await User.findByIdAndUpdate(donor.user._id || donor.user, userUpdates, {
      runValidators: true,
    });

    return Donor.findById(id).populate(populateOptions);
  }

  return donor;
};

const deleteDonor = async (id) => {
  const donor = await Donor.findById(id);

  if (!donor) {
    throw new AppError('Donor not found.', 404);
  }

  await User.findByIdAndDelete(donor.user);
  await Donor.findByIdAndDelete(id);

  return donor;
};

module.exports = {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
