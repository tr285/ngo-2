const volunteerService = require('../services/volunteerService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await volunteerService.createVolunteer(req.body);
  sendSuccess(res, 'Volunteer created successfully', { volunteer }, 201);
});

const getAllVolunteers = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.query;
  const result = await volunteerService.getAllVolunteers({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
  });
  sendSuccess(res, 'Volunteers retrieved successfully', result);
});

const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await volunteerService.getVolunteerById(req.params.id);
  sendSuccess(res, 'Volunteer retrieved successfully', { volunteer });
});

const updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await volunteerService.updateVolunteer(
    req.params.id,
    req.body,
    req.user
  );
  sendSuccess(res, 'Volunteer updated successfully', { volunteer });
});

const deleteVolunteer = asyncHandler(async (req, res) => {
  await volunteerService.deleteVolunteer(req.params.id);
  sendSuccess(res, 'Volunteer deleted successfully');
});

module.exports = {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
};
