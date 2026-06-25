const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createUser = asyncHandler(async (req, res) => {
  const { user, token } = await userService.createUser(req.body);

  sendSuccess(res, 'User created successfully', { user, token }, 201);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, role, search } = req.query;
  const result = await userService.getAllUsers({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    role,
    search,
  });

  sendSuccess(res, 'Users retrieved successfully', result);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  sendSuccess(res, 'User retrieved successfully', { user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  sendSuccess(res, 'User updated successfully', { user });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);

  sendSuccess(res, 'User deleted successfully');
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
