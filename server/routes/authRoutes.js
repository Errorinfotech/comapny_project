const express = require('express');
const router = express.Router();
const { loginUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateProfile); // Keep PUT for legacy
router.post('/update-password', protect, updateProfile); // Add POST as stable alternative

module.exports = router;
