const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const AppError = require('../utils/AppError');
const { ROLES } = require('../constants/roles');
const { paginateQuery } = require('../utils/pagination');

const populateOptions = [
  { path: 'user', select: 'firstName lastName email phone isActive' },
  { path: 'approvedBy', select: 'firstName lastName email' },
];

const buildSearchQuery = (search, status) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { skills: { $regex: search, $options: 'i' } },
      { availability: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

const createVolunteer = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    bio,
    skills,
    availability,
    address,
    emergencyContact,
    dateOfBirth,
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
    password: password || 'Volunteer@123',
    role: ROLES.VOLUNTEER,
    phone,
  });

  const volunteer = await Volunteer.create({
    user: user._id,
    bio,
    skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    availability,
    address,
    emergencyContact,
    dateOfBirth,
    status: status || 'pending',
    notes,
  });

  return Volunteer.findById(volunteer._id).populate(populateOptions);
};

const getAllVolunteers = async ({ page, limit, search, status }) => {
  const query = buildSearchQuery(search, status);

  if (search) {
    const users = await User.find({
      role: ROLES.VOLUNTEER,
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    const userIds = users.map((u) => u._id);

    query.$or = [
      ...(query.$or || []),
      { user: { $in: userIds } },
    ];
  }

  const result = await paginateQuery(Volunteer, {
    query,
    page,
    limit,
    populate: populateOptions,
  });

  return { volunteers: result.items, pagination: result.pagination };
};

const getVolunteerById = async (id) => {
  const volunteer = await Volunteer.findById(id).populate(populateOptions);

  if (!volunteer) {
    throw new AppError('Volunteer not found.', 404);
  }

  return volunteer;
};

const updateVolunteer = async (id, updates, adminUser) => {
  const allowedFields = [
    'bio',
    'skills',
    'availability',
    'address',
    'emergencyContact',
    'dateOfBirth',
    'status',
    'totalHours',
    'notes',
  ];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === 'skills' && typeof updates.skills === 'string') {
        filteredUpdates.skills = updates.skills.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        filteredUpdates[field] = updates[field];
      }
    }
  });

  if (updates.status === 'approved' || updates.status === 'active') {
    filteredUpdates.approvedBy = adminUser._id;
    filteredUpdates.approvedAt = new Date();
  }

  const volunteer = await Volunteer.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!volunteer) {
    throw new AppError('Volunteer not found.', 404);
  }

  if (updates.firstName || updates.lastName || updates.phone || updates.isActive !== undefined) {
    const userUpdates = {};
    if (updates.firstName !== undefined) userUpdates.firstName = updates.firstName;
    if (updates.lastName !== undefined) userUpdates.lastName = updates.lastName;
    if (updates.phone !== undefined) userUpdates.phone = updates.phone;
    if (updates.isActive !== undefined) userUpdates.isActive = updates.isActive;

    await User.findByIdAndUpdate(volunteer.user._id || volunteer.user, userUpdates, {
      runValidators: true,
    });

    return Volunteer.findById(id).populate(populateOptions);
  }

  return volunteer;
};

const deleteVolunteer = async (id) => {
  const volunteer = await Volunteer.findById(id);

  if (!volunteer) {
    throw new AppError('Volunteer not found.', 404);
  }

  await User.findByIdAndDelete(volunteer.user);
  await Volunteer.findByIdAndDelete(id);

  return volunteer;
};

module.exports = {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
};
