const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const {
      email,
      phone,
      password,
      firstName,
      lastName,
      birthYear,
      gender,
      ntrpInitial,
      preferredLanguage = 'az'
    } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (
        email, phone, password_hash, first_name, last_name, 
        birth_year, gender, ntrp_initial, preferred_language
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, email, phone, first_name, last_name, birth_year, 
                gender, ntrp_initial, elo_rating, created_at
    `;

    const values = [
      email.toLowerCase(),
      phone,
      passwordHash,
      firstName,
      lastName,
      birthYear,
      gender,
      ntrpInitial,
      preferredLanguage
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND account_status = $2';
    const result = await db.query(query, [email.toLowerCase(), 'active']);
    return result.rows[0];
  }

  // Find user by phone
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1 AND account_status = $2';
    const result = await db.query(query, [phone, 'active']);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT 
        id, email, phone, first_name, last_name, birth_year, gender,
        profile_photo_url, bio, ntrp_initial, elo_rating, elo_provisional,
        matches_played_for_elo, playing_hand, years_playing, preferred_format,
        preferred_surface, player_type, favorite_pro_player, email_verified,
        phone_verified, profile_complete, availability_status, weekly_availability,
        preferred_times, profile_visibility, hide_phone, hide_last_name,
        total_matches, wins, losses, current_streak, reliability_rating,
        preferred_language, created_at, last_active
      FROM users 
      WHERE id = $1 AND account_status = $2
    `;
    const result = await db.query(query, [id, 'active']);
    return result.rows[0];
  }

  // Get public profile (hide sensitive data)
  static async getPublicProfile(id, viewerId) {
    // Check if viewer has blocked this user or vice versa
    const blockCheck = await db.query(
      `SELECT 1 FROM blocked_users 
       WHERE (blocker_id = $1 AND blocked_id = $2) 
       OR (blocker_id = $2 AND blocked_id = $1)`,
      [viewerId, id]
    );

    if (blockCheck.rows.length > 0) {
      return null; // User is blocked
    }

    const query = `
      SELECT 
        id, 
        first_name, 
        CASE 
          WHEN hide_last_name = true THEN CONCAT(SUBSTRING(last_name, 1, 1), '.')
          ELSE last_name 
        END as last_name,
        birth_year, gender, profile_photo_url, bio, elo_rating, 
        elo_to_ntrp(elo_rating) as ntrp_rating,
        elo_provisional, playing_hand, years_playing, preferred_format,
        preferred_surface, favorite_pro_player, total_matches, wins, losses,
        current_streak, reliability_rating, availability_status,
        CASE 
          WHEN hide_phone = true THEN NULL 
          ELSE phone 
        END as phone,
        created_at
      FROM users 
      WHERE id = $1 AND account_status = $2 
      AND (profile_visibility = 'public' OR id = $3)
    `;
    
    const result = await db.query(query, [id, 'active', viewerId]);
    return result.rows[0];
  }

  // Update user profile
  static async update(id, updateData) {
    const allowedFields = [
      'first_name', 'last_name', 'birth_year', 'gender', 'profile_photo_url',
      'bio', 'playing_hand', 'years_playing', 'preferred_format', 
      'preferred_surface', 'player_type', 'favorite_pro_player',
      'weekly_availability', 'preferred_times', 'availability_status',
      'profile_visibility', 'hide_phone', 'hide_last_name', 'preferred_language'
    ];

    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update email verification status
  static async verifyEmail(id) {
    const query = `
      UPDATE users 
      SET email_verified = true, email_verification_token = NULL 
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Set phone verification code
  static async setPhoneVerificationCode(id, code) {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const query = `
      UPDATE users 
      SET phone_verification_code = $1, phone_verification_expires = $2
      WHERE id = $3
      RETURNING id
    `;
    const result = await db.query(query, [code, expiresAt, id]);
    return result.rows[0];
  }

  // Verify phone with code (or skip verification in dev mode)
  static async verifyPhone(id, code) {
    // For development: accept dummy code '000000' to auto-verify
    if (code === '000000') {
      const query = `
        UPDATE users 
        SET phone_verified = true, 
            email_verified = true,
            phone_verification_code = NULL,
            phone_verification_expires = NULL
        WHERE id = $1
        RETURNING id
      `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    }
    
    // Original verification logic for production
    const query = `
      UPDATE users 
      SET phone_verified = true, 
          phone_verification_code = NULL,
          phone_verification_expires = NULL
      WHERE id = $1 
        AND phone_verification_code = $2 
        AND phone_verification_expires > NOW()
      RETURNING id
    `;
    const result = await db.query(query, [id, code]);
    return result.rows[0];
  }

  // Check if profile is complete
  static async checkProfileComplete(id) {
    const user = await this.findById(id);
    const isComplete = !!(
      user.first_name &&
      user.last_name &&
      user.phone_verified &&
      user.email_verified &&
      user.ntrp_initial &&
      user.playing_hand
    );

    if (isComplete && !user.profile_complete) {
      await db.query(
        'UPDATE users SET profile_complete = true WHERE id = $1',
        [id]
      );
    }

    return isComplete;
  }

  // Update last active timestamp
  static async updateLastActive(id) {
    await db.query(
      'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  // Block a user
  static async blockUser(blockerId, blockedId) {
    const query = `
      INSERT INTO blocked_users (blocker_id, blocked_id)
      VALUES ($1, $2)
      ON CONFLICT (blocker_id, blocked_id) DO NOTHING
      RETURNING id
    `;
    const result = await db.query(query, [blockerId, blockedId]);
    return result.rows[0];
  }

  // Unblock a user
  static async unblockUser(blockerId, blockedId) {
    const query = `
      DELETE FROM blocked_users 
      WHERE blocker_id = $1 AND blocked_id = $2
      RETURNING id
    `;
    const result = await db.query(query, [blockerId, blockedId]);
    return result.rows[0];
  }

  // Get blocked users list
  static async getBlockedUsers(userId) {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.profile_photo_url
      FROM blocked_users bu
      JOIN users u ON bu.blocked_id = u.id
      WHERE bu.blocker_id = $1
      ORDER BY bu.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = User;
