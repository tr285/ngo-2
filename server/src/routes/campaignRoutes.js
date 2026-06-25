const express = require('express');
const campaignController = require('../controllers/campaignController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(campaignController.getAllCampaigns)
  .post(authorizeAdmin, campaignController.createCampaign);

router
  .route('/:id')
  .get(campaignController.getCampaignById)
  .patch(authorizeAdmin, campaignController.updateCampaign)
  .delete(authorizeAdmin, campaignController.deleteCampaign);

module.exports = router;
