const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getDashboard = asyncHandler(async (req, res) => {
  sendSuccess(res, 'Volunteer dashboard accessed successfully', {
    dashboard: {
      role: req.user.role,
      assignedTasks: [],
      upcomingEvents: [],
    },
  });
});

const getTasks = asyncHandler(async (req, res) => {
  sendSuccess(res, 'Volunteer tasks retrieved successfully', {
    tasks: [],
  });
});

module.exports = { getDashboard, getTasks };
