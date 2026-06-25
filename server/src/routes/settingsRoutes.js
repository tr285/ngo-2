const express = require('express');
const settingsController = require('../controllers/settingsController');
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { changePasswordValidator } = require('../validators/authValidator');

const router = express.Router();

router.use(protect);

router.get('/profile', settingsController.getProfile);
router.patch('/profile', upload.single('avatar'), settingsController.updateProfile);
router.patch('/change-password', changePasswordValidator, validate, settingsController.changePassword);
router.get('/ngo', authorizeAdmin, settingsController.getNgoProfile);

module.exports = router;
