const express = require('express');
const reportController = require('../controllers/reportController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router.post('/generate', reportController.generateReport);
router.get('/', reportController.getAllReports);
router.get('/:id/download', reportController.downloadReport);
router.get('/:id', reportController.getReportById);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
