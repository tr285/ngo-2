const express = require('express');
const volunteerManagementController = require('../controllers/volunteerManagementController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router
  .route('/')
  .get(volunteerManagementController.getAllVolunteers)
  .post(volunteerManagementController.createVolunteer);

router
  .route('/:id')
  .get(volunteerManagementController.getVolunteerById)
  .patch(volunteerManagementController.updateVolunteer)
  .delete(volunteerManagementController.deleteVolunteer);

module.exports = router;
