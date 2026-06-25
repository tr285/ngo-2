const campaignService = require('../services/campaignService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body, req.user._id);
  sendSuccess(res, 'Campaign created successfully', { campaign }, 201);
});

const getAllCampaigns = asyncHandler(async (req, res) => {
  const { page, limit, search, status, category } = req.query;
  const result = await campaignService.getAllCampaigns({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    category,
  });
  sendSuccess(res, 'Campaigns retrieved successfully', result);
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.params.id);
  sendSuccess(res, 'Campaign retrieved successfully', { campaign });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaign(req.params.id, req.body);
  sendSuccess(res, 'Campaign updated successfully', { campaign });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  await campaignService.deleteCampaign(req.params.id);
  sendSuccess(res, 'Campaign deleted successfully');
});

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
