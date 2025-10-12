const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user profile
router.get('/', profileController.getProfile);

// Update user profile
router.put('/', profileController.updateProfile);

// Change password
router.put('/password', profileController.changePassword);

// Delete account
router.delete('/', profileController.deleteAccount);

module.exports = router;