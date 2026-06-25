const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const AppError = require('../utils/AppError');
const { ROLES, PUBLIC_REGISTER_ROLES } = require('../constants/roles');

const resolveRegisterRole = (requestedRole) => {
  if (requestedRole && PUBLIC_REGISTER_ROLES.includes(requestedRole)) {
    return requestedRole;
  }

  return ROLES.DONOR;
};

const register = async ({ firstName, lastName, email, password, role, phone }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already registered.', 409);
  }

  const resolvedRole = resolveRegisterRole(role);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: resolvedRole,
    phone,
  });

  if (resolvedRole === ROLES.VOLUNTEER) {
    await Volunteer.create({ user: user._id });
  } else if (resolvedRole === ROLES.DONOR) {
    await Donor.create({ user: user._id });
  }

  const token = user.generateAuthToken();

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated.', 403);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = user.generateAuthToken();

  return { user, token };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

const updateProfile = async (userId, updates) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 401);
  }

  user.password = newPassword;
  await user.save();

  const token = user.generateAuthToken();

  return { user, token };
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
