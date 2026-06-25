const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/reports', adminController.getReports);

module.exports = router;
