const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

router.get('/me', protect, authController.getMe);
router.patch('/me', protect, updateProfileValidator, validate, authController.updateProfile);
router.patch(
  '/change-password',
  protect,
  changePasswordValidator,
  validate,
  authController.changePassword
);

module.exports = router;
