const express = require('express');
const beneficiaryController = require('../controllers/beneficiaryController');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router
  .route('/')
  .get(beneficiaryController.getAllBeneficiaries)
  .post(beneficiaryController.createBeneficiary);

router
  .route('/:id')
  .get(beneficiaryController.getBeneficiaryById)
  .patch(beneficiaryController.updateBeneficiary)
  .delete(beneficiaryController.deleteBeneficiary);

module.exports = router;
