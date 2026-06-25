const donationService = require('../services/donationService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getAllDonations = asyncHandler(async (req, res) => {
  const { page, limit, search, status, campaign, paymentGateway } = req.query;
  const result = await donationService.getAllDonations({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    campaign,
    paymentGateway,
  });
  sendSuccess(res, 'Donations retrieved successfully', result);
});

const getMyDonations = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.query;
  const result = await donationService.getDonorDonations(req.user._id, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    status,
    search,
  });
  sendSuccess(res, 'Your donations retrieved successfully', result);
});

const getTransactionHistory = asyncHandler(async (req, res) => {
  const result = await donationService.getTransactionHistory(req.user);
  sendSuccess(res, 'Transaction history retrieved successfully', result);
});

const getCampaignProgress = asyncHandler(async (req, res) => {
  const campaigns = await donationService.getCampaignProgress();
  sendSuccess(res, 'Campaign progress retrieved successfully', { campaigns });
});

const getDonationById = asyncHandler(async (req, res) => {
  const donation = await donationService.getDonationById(req.params.id, req.user);
  sendSuccess(res, 'Donation retrieved successfully', { donation });
});

const getReceipt = asyncHandler(async (req, res) => {
  const receipt = await donationService.getReceipt(req.params.id, req.user);
  sendSuccess(res, 'Receipt retrieved successfully', { receipt });
});

const createManualDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.createManualDonation(req.body, req.user);
  sendSuccess(res, 'Donation recorded successfully', { donation }, 201);
});

const initiateCheckout = asyncHandler(async (req, res) => {
  const result = await donationService.initiateCheckout(req.body, req.user);
  sendSuccess(res, 'Checkout initiated successfully', result, 201);
});

const confirmRazorpay = asyncHandler(async (req, res) => {
  const donation = await donationService.confirmRazorpayPayment(req.body, req.user);
  sendSuccess(res, 'Razorpay payment confirmed successfully', { donation });
});

const confirmStripe = asyncHandler(async (req, res) => {
  const donation = await donationService.confirmStripePayment(req.body, req.user);
  sendSuccess(res, 'Stripe payment confirmed successfully', { donation });
});

const updateDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.updateDonation(req.params.id, req.body);
  sendSuccess(res, 'Donation updated successfully', { donation });
});

const deleteDonation = asyncHandler(async (req, res) => {
  await donationService.deleteDonation(req.params.id);
  sendSuccess(res, 'Donation deleted successfully');
});

module.exports = {
  getAllDonations,
  getMyDonations,
  getTransactionHistory,
  getCampaignProgress,
  getDonationById,
  getReceipt,
  createManualDonation,
  initiateCheckout,
  confirmRazorpay,
  confirmStripe,
  updateDonation,
  deleteDonation,
};
