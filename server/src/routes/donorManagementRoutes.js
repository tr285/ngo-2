const express = require('express');
const donorManagementController = require('../controllers/donorManagementController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router
  .route('/')
  .get(donorManagementController.getAllDonors)
  .post(donorManagementController.createDonor);

router
  .route('/:id')
  .get(donorManagementController.getDonorById)
  .patch(donorManagementController.updateDonor)
  .delete(donorManagementController.deleteDonor);

module.exports = router;
