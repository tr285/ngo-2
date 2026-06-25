const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const { paginateQuery } = require('../utils/pagination');

const populateOptions = [
  { path: 'organizer', select: 'firstName lastName email' },
  { path: 'campaign', select: 'title status' },
  { path: 'volunteers.volunteer', populate: { path: 'user', select: 'firstName lastName email' } },
];

const createEvent = async (data, userId) => {
  const payload = { ...data, organizer: userId };

  if (typeof payload.requiredSkills === 'string') {
    payload.requiredSkills = payload.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const event = await Event.create(payload);

  return Event.findById(event._id).populate(populateOptions);
};

const getAllEvents = async ({ page, limit, search, status }) => {
  const query = {};

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { 'location.venue': { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Event, {
    query,
    page,
    limit,
    populate: populateOptions,
    sort: { startDate: 1 },
  });

  return { events: result.items, pagination: result.pagination };
};

const getEventById = async (id) => {
  const event = await Event.findById(id).populate(populateOptions);

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  return event;
};

const updateEvent = async (id, updates) => {
  const allowedFields = [
    'title',
    'description',
    'location',
    'startDate',
    'endDate',
    'registrationDeadline',
    'status',
    'maxVolunteers',
    'campaign',
    'coverImage',
    'requiredSkills',
    'isPublic',
  ];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === 'requiredSkills' && typeof updates.requiredSkills === 'string') {
        filteredUpdates.requiredSkills = updates.requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        filteredUpdates[field] = updates[field];
      }
    }
  });

  const event = await Event.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  return event;
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
