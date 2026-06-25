const eventService = require('../services/eventService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body, req.user._id);
  sendSuccess(res, 'Event created successfully', { event }, 201);
});

const getAllEvents = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.query;
  const result = await eventService.getAllEvents({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
  });
  sendSuccess(res, 'Events retrieved successfully', result);
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  sendSuccess(res, 'Event retrieved successfully', { event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  sendSuccess(res, 'Event updated successfully', { event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);
  sendSuccess(res, 'Event deleted successfully');
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
