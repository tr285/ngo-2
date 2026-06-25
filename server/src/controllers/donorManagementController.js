const donorService = require('../services/donorService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createDonor = asyncHandler(async (req, res) => {
  const donor = await donorService.createDonor(req.body);
  sendSuccess(res, 'Donor created successfully', { donor }, 201);
});

const getAllDonors = asyncHandler(async (req, res) => {
  const { page, limit, search, status, donorType } = req.query;
  const result = await donorService.getAllDonors({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    donorType,
  });
  sendSuccess(res, 'Donors retrieved successfully', result);
});

const getDonorById = asyncHandler(async (req, res) => {
  const donor = await donorService.getDonorById(req.params.id);
  sendSuccess(res, 'Donor retrieved successfully', { donor });
});

const updateDonor = asyncHandler(async (req, res) => {
  const donor = await donorService.updateDonor(req.params.id, req.body);
  sendSuccess(res, 'Donor updated successfully', { donor });
});

const deleteDonor = asyncHandler(async (req, res) => {
  await donorService.deleteDonor(req.params.id);
  sendSuccess(res, 'Donor deleted successfully');
});

module.exports = {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
