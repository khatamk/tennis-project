const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  searchPlayers,
  blockUser,
  unblockUser,
  getBlockedUsers
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public/optional auth routes
router.get('/search', protect, searchPlayers);
router.get('/:id', optionalAuth, getUserProfile);

// Protected routes
router.put('/profile', protect, updateProfile);
router.post('/:id/block', protect, blockUser);
router.delete('/:id/block', protect, unblockUser);
router.get('/blocked/list', protect, getBlockedUsers);

module.exports = router;
