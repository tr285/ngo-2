const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(authorizeAdmin, eventController.createEvent);

router
  .route('/:id')
  .get(eventController.getEventById)
  .patch(authorizeAdmin, eventController.updateEvent)
  .delete(authorizeAdmin, eventController.deleteEvent);

module.exports = router;
