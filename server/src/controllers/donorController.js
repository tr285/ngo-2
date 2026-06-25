const donationService = require('../services/donationService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getDashboard = asyncHandler(async (req, res) => {
  const { donations, donor } = await donationService.getDonorDonations(req.user._id, {
    page: 1,
    limit: 5,
  });

  sendSuccess(res, 'Donor dashboard accessed successfully', {
    dashboard: {
      role: req.user.role,
      totalDonated: donor.totalDonated,
      donationCount: donor.donationCount,
      recentDonations: donations,
    },
  });
});

const getDonations = asyncHandler(async (req, res) => {
  const result = await donationService.getDonorDonations(req.user._id, {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
    status: req.query.status,
  });

  sendSuccess(res, 'Donor donations retrieved successfully', result);
});

module.exports = { getDashboard, getDonations };
