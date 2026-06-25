const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  sendSuccess(res, 'Registration successful', { user, token }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  sendSuccess(res, 'Login successful', { user, token });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);

  sendSuccess(res, 'Profile retrieved successfully', { user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);

  sendSuccess(res, 'Profile updated successfully', { user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { user, token } = await authService.changePassword(
    req.user._id,
    req.body
  );

  sendSuccess(res, 'Password changed successfully', { user, token });
});

module.exports = { register, login, getMe, updateProfile, changePassword };
