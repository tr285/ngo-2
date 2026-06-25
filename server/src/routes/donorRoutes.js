const express = require('express');
const donorController = require('../controllers/donorController');
const { protect, authorizeDonor } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeDonor);

router.get('/dashboard', donorController.getDashboard);
router.get('/donations', donorController.getDonations);

module.exports = router;
