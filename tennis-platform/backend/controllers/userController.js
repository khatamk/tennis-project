const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (but respects privacy settings)
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user ? req.user.id : null;

    const user = await User.getPublicProfile(id, viewerId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or blocked'
      });
    }

    // Calculate win percentage
    const winPercentage = user.total_matches > 0 
      ? ((user.wins / user.total_matches) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        birthYear: user.birth_year,
        gender: user.gender,
        profilePhotoUrl: user.profile_photo_url,
        bio: user.bio,
        eloRating: user.elo_rating,
        ntrpRating: parseFloat(user.ntrp_rating),
        eloProvisional: user.elo_provisional,
        playingHand: user.playing_hand,
        yearsPlaying: user.years_playing,
        preferredFormat: user.preferred_format,
        preferredSurface: user.preferred_surface,
        favoriteProPlayer: user.favorite_pro_player,
        stats: {
          totalMatches: user.total_matches,
          wins: user.wins,
          losses: user.losses,
          winPercentage: parseFloat(winPercentage),
          currentStreak: user.current_streak
        },
        reliabilityRating: parseFloat(user.reliability_rating),
        availabilityStatus: user.availability_status,
        phone: user.phone, // Only shown if hide_phone is false
        memberSince: user.created_at
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.email;
    delete updateData.phone;
    delete updateData.password;
    delete updateData.elo_rating;
    delete updateData.total_matches;
    delete updateData.wins;
    delete updateData.losses;

    const updatedUser = await User.update(userId, updateData);

    // Check if profile is now complete
    await User.checkProfileComplete(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @desc    Search for players
// @route   GET /api/users/search
// @access  Private
exports.searchPlayers = async (req, res) => {
  try {
    const {
      minRating,
      maxRating,
      preferredFormat,
      availableNow,
      gender,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
    const viewerId = req.user.id;

    // Build query
    let query = `
      SELECT 
        id, first_name, 
        CASE 
          WHEN hide_last_name = true THEN CONCAT(SUBSTRING(last_name, 1, 1), '.')
          ELSE last_name 
        END as last_name,
        profile_photo_url, elo_rating, 
        elo_to_ntrp(elo_rating) as ntrp_rating,
        preferred_format, total_matches, wins, losses,
        reliability_rating, availability_status
      FROM users
      WHERE account_status = 'active' 
        AND profile_complete = true
        AND id != $1
        AND id NOT IN (
          SELECT blocked_id FROM blocked_users WHERE blocker_id = $1
          UNION
          SELECT blocker_id FROM blocked_users WHERE blocked_id = $1
        )
        AND profile_visibility = 'public'
    `;

    const params = [viewerId];
    let paramCount = 2;

    if (minRating) {
      query += ` AND elo_rating >= $${paramCount}`;
      params.push(parseInt(minRating));
      paramCount++;
    }

    if (maxRating) {
      query += ` AND elo_rating <= $${paramCount}`;
      params.push(parseInt(maxRating));
      paramCount++;
    }

    if (preferredFormat) {
      query += ` AND (preferred_format = $${paramCount} OR preferred_format = 'both')`;
      params.push(preferredFormat);
      paramCount++;
    }

    if (availableNow === 'true') {
      query += ` AND availability_status = 'available_now'`;
    }

    if (gender) {
      query += ` AND gender = $${paramCount}`;
      params.push(gender);
      paramCount++;
    }

    // Add ordering and pagination
    query += ` ORDER BY elo_rating DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const db = require('../config/database');
    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) FROM users
      WHERE account_status = 'active' 
        AND profile_complete = true
        AND id != $1
        AND id NOT IN (
          SELECT blocked_id FROM blocked_users WHERE blocker_id = $1
          UNION
          SELECT blocker_id FROM blocked_users WHERE blocked_id = $1
        )
        AND profile_visibility = 'public'
    `;
    
    const countParams = [viewerId];
    const countResult = await db.query(countQuery, countParams);
    const totalPlayers = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      players: result.rows.map(player => ({
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        profilePhotoUrl: player.profile_photo_url,
        eloRating: player.elo_rating,
        ntrpRating: parseFloat(player.ntrp_rating),
        preferredFormat: player.preferred_format,
        stats: {
          totalMatches: player.total_matches,
          wins: player.wins,
          losses: player.losses,
          winPercentage: player.total_matches > 0 
            ? ((player.wins / player.total_matches) * 100).toFixed(1)
            : 0
        },
        reliabilityRating: parseFloat(player.reliability_rating),
        availabilityStatus: player.availability_status
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPlayers / limit),
        totalPlayers,
        playersPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search players error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Block a user
// @route   POST /api/users/:id/block
// @access  Private
exports.blockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = req.params.id;

    if (blockerId === blockedId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot block yourself'
      });
    }

    await User.blockUser(blockerId, blockedId);

    res.json({
      success: true,
      message: 'User blocked successfully'
    });

  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Unblock a user
// @route   DELETE /api/users/:id/block
// @access  Private
exports.unblockUser = async (req, res) => {
  try {
    const blockerId = req.user.id;
    const blockedId = req.params.id;

    await User.unblockUser(blockerId, blockedId);

    res.json({
      success: true,
      message: 'User unblocked successfully'
    });

  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get blocked users list
// @route   GET /api/users/blocked
// @access  Private
exports.getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const blockedUsers = await User.getBlockedUsers(userId);

    res.json({
      success: true,
      blockedUsers
    });

  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
