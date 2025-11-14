const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyPhone,
  resendPhoneCode,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.post('/verify-phone', protect, verifyPhone);
router.post('/resend-phone-code', protect, resendPhoneCode);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
