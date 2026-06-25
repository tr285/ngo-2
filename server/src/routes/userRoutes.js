const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { protect, authorizeAdmin } = require('../middleware/auth');
const { createUserValidator } = require('../validators/authValidator');

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router.post('/', createUserValidator, validate, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
