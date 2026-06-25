const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const { protect, authorizeVolunteer } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeVolunteer);

router.get('/dashboard', volunteerController.getDashboard);
router.get('/tasks', volunteerController.getTasks);

module.exports = router;
