const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// GET /api/settings/profile  — returns current user's profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found.', 404);
  sendSuccess(res, 'Profile retrieved successfully', { user });
});

// PATCH /api/settings/profile  — update name, phone, avatar
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (phone !== undefined) updates.phone = phone;

  // Handle logo/avatar upload
  if (req.file) {
    updates.avatar = `/uploads/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError('User not found.', 404);
  sendSuccess(res, 'Profile updated successfully', { user });
});

// PATCH /api/settings/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new AppError('User not found.', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect.', 401);

  user.password = newPassword;
  await user.save();

  const token = user.generateAuthToken();
  sendSuccess(res, 'Password changed successfully', { token });
});

// GET /api/settings/ngo  — NGO profile (admin only, stored in a config document or env)
const getNgoProfile = asyncHandler(async (_req, res) => {
  // Return a static/env-based NGO profile (can be extended to a DB collection later)
  const ngoProfile = {
    name: process.env.NGO_NAME || 'NGO Management System',
    tagline: process.env.NGO_TAGLINE || 'Empowering Communities Together',
    email: process.env.NGO_EMAIL || 'contact@ngo.org',
    phone: process.env.NGO_PHONE || '',
    address: process.env.NGO_ADDRESS || '',
    website: process.env.NGO_WEBSITE || '',
    registrationNumber: process.env.NGO_REG_NUMBER || '',
    logoUrl: process.env.NGO_LOGO_URL || '',
  };
  sendSuccess(res, 'NGO profile retrieved', { ngoProfile });
});

module.exports = { getProfile, updateProfile, changePassword, getNgoProfile };
