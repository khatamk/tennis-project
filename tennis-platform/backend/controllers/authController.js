const User = require('../models/User');
const { generateToken, generateEmailVerificationToken, verifyEmailVerificationToken } = require('../utils/jwt');
const { generateVerificationCode, sendVerificationSMS, formatPhoneNumber, validatePhoneNumber } = require('../utils/sms');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      email,
      phone,
      password,
      firstName,
      lastName,
      birthYear,
      gender,
      ntrpInitial,
      preferredLanguage
    } = req.body;

    // Validate required fields
    if (!email || !phone || !password || !firstName || !lastName || !ntrpInitial) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format for Azerbaijan'
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Check if user already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const existingPhone = await User.findByPhone(formattedPhone);
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered'
      });
    }

    // Validate NTRP rating
    if (ntrpInitial < 1.0 || ntrpInitial > 7.0) {
      return res.status(400).json({
        success: false,
        error: 'NTRP rating must be between 1.0 and 7.0'
      });
    }

    // Create user
    const user = await User.create({
      email,
      phone: formattedPhone,
      password,
      firstName,
      lastName,
      birthYear,
      gender,
      ntrpInitial,
      preferredLanguage: preferredLanguage || 'az'
    });

    // Auto-verify phone for now (skip SMS verification)
    await User.verifyPhone(user.id, '000000'); // Dummy code to mark as verified
    await User.checkProfileComplete(user.id);

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        ntrpInitial: user.ntrp_initial,
        eloRating: user.elo_rating,
        phoneVerified: true,  // Auto-verified
        emailVerified: true,   // Auto-verified for now
        profileComplete: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate input
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email/phone and password'
      });
    }

    // Find user by email or phone
    let user;
    if (emailOrPhone.includes('@')) {
      user = await User.findByEmail(emailOrPhone);
    } else {
      const formattedPhone = formatPhoneNumber(emailOrPhone);
      user = await User.findByPhone(formattedPhone);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Update last active
    await User.updateLastActive(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        eloRating: user.elo_rating,
        ntrpRating: user.ntrp_initial,
        phoneVerified: user.phone_verified,
        emailVerified: user.email_verified,
        profileComplete: user.profile_complete,
        profilePhotoUrl: user.profile_photo_url
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// @desc    Verify phone number with code
// @route   POST /api/auth/verify-phone
// @access  Private
exports.verifyPhone = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Please provide verification code'
      });
    }

    // Verify code
    const result = await User.verifyPhone(userId, code);

    if (!result) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code'
      });
    }

    // Check if profile is complete
    await User.checkProfileComplete(userId);

    res.json({
      success: true,
      message: 'Phone number verified successfully'
    });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during phone verification'
    });
  }
};

// @desc    Resend phone verification code
// @route   POST /api/auth/resend-phone-code
// @access  Private
exports.resendPhoneCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const phone = req.user.phone;

    if (req.user.phone_verified) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already verified'
      });
    }

    // Generate new code
    const verificationCode = generateVerificationCode();
    await User.setPhoneVerificationCode(userId, verificationCode);

    // Send SMS
    await sendVerificationSMS(phone, verificationCode);

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });

  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend verification code'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        birthYear: user.birth_year,
        gender: user.gender,
        profilePhotoUrl: user.profile_photo_url,
        bio: user.bio,
        ntrpInitial: user.ntrp_initial,
        eloRating: user.elo_rating,
        eloProvisional: user.elo_provisional,
        matchesPlayedForElo: user.matches_played_for_elo,
        playingHand: user.playing_hand,
        yearsPlaying: user.years_playing,
        preferredFormat: user.preferred_format,
        preferredSurface: user.preferred_surface,
        playerType: user.player_type,
        favoriteProPlayer: user.favorite_pro_player,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        profileComplete: user.profile_complete,
        availabilityStatus: user.availability_status,
        weeklyAvailability: user.weekly_availability,
        preferredTimes: user.preferred_times,
        totalMatches: user.total_matches,
        wins: user.wins,
        losses: user.losses,
        currentStreak: user.current_streak,
        reliabilityRating: user.reliability_rating,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
        lastActive: user.last_active
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Logout user (client-side mainly, invalidate token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  // In JWT-based auth, logout is mainly client-side (delete token)
  // But we can update last_active timestamp
  try {
    await User.updateLastActive(req.user.id);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
};
