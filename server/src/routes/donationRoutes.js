const express = require('express');
const donationController = require('../controllers/donationController');
const { protect, authorize, authorizeAdmin, authorizeDonor } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(protect);

router.get('/campaign-progress', donationController.getCampaignProgress);
router.get('/history', donationController.getTransactionHistory);

router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.DONOR),
  (req, res, next) => {
    if (req.user.role === ROLES.ADMIN) {
      return donationController.getAllDonations(req, res, next);
    }
    return donationController.getMyDonations(req, res, next);
  }
);

router.post('/checkout', authorizeDonor, donationController.initiateCheckout);
router.post('/razorpay/confirm', authorizeDonor, donationController.confirmRazorpay);
router.post('/stripe/confirm', authorizeDonor, donationController.confirmStripe);

router.post('/', authorizeAdmin, donationController.createManualDonation);

router.get('/:id/receipt', authorize(ROLES.ADMIN, ROLES.DONOR), donationController.getReceipt);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.DONOR), donationController.getDonationById);
router.patch('/:id', authorizeAdmin, donationController.updateDonation);
router.delete('/:id', authorizeAdmin, donationController.deleteDonation);

module.exports = router;
