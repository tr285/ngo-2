const beneficiaryService = require('../services/beneficiaryService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createBeneficiary = asyncHandler(async (req, res) => {
  const beneficiary = await beneficiaryService.createBeneficiary(req.body, req.user._id);
  sendSuccess(res, 'Beneficiary created successfully', { beneficiary }, 201);
});

const getAllBeneficiaries = asyncHandler(async (req, res) => {
  const { page, limit, search, status, beneficiaryType } = req.query;
  const result = await beneficiaryService.getAllBeneficiaries({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    beneficiaryType,
  });
  sendSuccess(res, 'Beneficiaries retrieved successfully', result);
});

const getBeneficiaryById = asyncHandler(async (req, res) => {
  const beneficiary = await beneficiaryService.getBeneficiaryById(req.params.id);
  sendSuccess(res, 'Beneficiary retrieved successfully', { beneficiary });
});

const updateBeneficiary = asyncHandler(async (req, res) => {
  const beneficiary = await beneficiaryService.updateBeneficiary(req.params.id, req.body);
  sendSuccess(res, 'Beneficiary updated successfully', { beneficiary });
});

const deleteBeneficiary = asyncHandler(async (req, res) => {
  await beneficiaryService.deleteBeneficiary(req.params.id);
  sendSuccess(res, 'Beneficiary deleted successfully');
});

module.exports = {
  createBeneficiary,
  getAllBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
};
