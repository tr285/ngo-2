const User = require('../models/User');
const AppError = require('../utils/AppError');
const { ROLES } = require('../constants/roles');

const createUser = async ({ firstName, lastName, email, password, role, phone }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already registered.', 409);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
  });

  const token = user.generateAuthToken();

  return { user, token };
};

const getAllUsers = async ({ page = 1, limit = 10, role, search }) => {
  const query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

const updateUser = async (userId, updates) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'role', 'isActive', 'avatar'];
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

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user.role === ROLES.ADMIN) {
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });

    if (adminCount <= 1) {
      throw new AppError('Cannot delete the last admin account.', 400);
    }
  }

  await User.findByIdAndDelete(userId);

  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
