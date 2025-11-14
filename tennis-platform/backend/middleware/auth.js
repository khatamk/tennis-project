const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware to protect routes (require authentication)
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if account is active
      if (user.account_status !== 'active') {
        return res.status(401).json({
          success: false,
          error: 'Account is suspended or deleted'
        });
      }

      // Attach user to request object
      req.user = user;

      // Update last active timestamp
      User.updateLastActive(user.id).catch(err => 
        console.error('Failed to update last active:', err)
      );

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    });
  }
};

// Middleware to check if email is verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user.email_verified) {
    return res.status(403).json({
      success: false,
      error: 'Please verify your email address first'
    });
  }
  next();
};

// Middleware to check if phone is verified
const requirePhoneVerification = (req, res, next) => {
  if (!req.user.phone_verified) {
    return res.status(403).json({
      success: false,
      error: 'Please verify your phone number first'
    });
  }
  next();
};

// Middleware to check if profile is complete
const requireCompleteProfile = (req, res, next) => {
  if (!req.user.profile_complete) {
    return res.status(403).json({
      success: false,
      error: 'Please complete your profile first'
    });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (user && user.account_status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Invalid token, but continue without user
        console.log('Invalid token in optional auth');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};

module.exports = {
  protect,
  requireEmailVerification,
  requirePhoneVerification,
  requireCompleteProfile,
  optionalAuth,
};
