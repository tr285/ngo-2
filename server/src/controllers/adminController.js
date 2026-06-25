const analyticsService = require('../services/analyticsService');
const reportService = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getDashboard = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getDashboardAnalytics();

  sendSuccess(res, 'Admin dashboard retrieved successfully', {
    dashboard: {
      role: req.user.role,
      ...analytics,
    },
  });
});

const getReports = asyncHandler(async (req, res) => {
  const { page, limit, reportType, search } = req.query;
  const result = await reportService.getAllReports({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    reportType,
    search,
  });

  sendSuccess(res, 'Admin reports retrieved successfully', result);
});

module.exports = { getDashboard, getReports };
