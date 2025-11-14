-- Tennis Platform Database Schema
-- Run this script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE hand_type AS ENUM ('right', 'left', 'ambidextrous');
CREATE TYPE match_format_type AS ENUM ('singles', 'doubles', 'both');
CREATE TYPE surface_type AS ENUM ('hard', 'clay', 'indoor', 'any');
CREATE TYPE player_type AS ENUM ('competitive', 'casual');
CREATE TYPE account_status_type AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE availability_status_type AS ENUM ('available_now', 'available_scheduled', 'not_available');
CREATE TYPE visibility_type AS ENUM ('public', 'private');
CREATE TYPE language_type AS ENUM ('az', 'ru', 'en');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Basic Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_year INTEGER,
    gender gender_type,
    profile_photo_url TEXT,
    bio VARCHAR(150),
    
    -- Tennis Info
    ntrp_initial DECIMAL(2,1), -- Initial self-assessment (1.0-6.0+)
    elo_rating INTEGER DEFAULT 1000, -- Current ELO rating (starting at 1000)
    elo_provisional BOOLEAN DEFAULT TRUE, -- First 10 matches
    matches_played_for_elo INTEGER DEFAULT 0, -- Count toward provisional
    playing_hand hand_type,
    years_playing INTEGER,
    preferred_format match_format_type DEFAULT 'both',
    preferred_surface surface_type DEFAULT 'any',
    player_type player_type DEFAULT 'casual', -- Coded but not used in MVP
    favorite_pro_player VARCHAR(100),
    
    -- Verification & Status
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verification_code VARCHAR(6),
    phone_verification_expires TIMESTAMP,
    profile_complete BOOLEAN DEFAULT FALSE,
    account_status account_status_type DEFAULT 'active',
    
    -- Availability
    availability_status availability_status_type DEFAULT 'available_scheduled',
    weekly_availability JSONB, -- {mon: {morning: false, afternoon: true, evening: true}, ...}
    preferred_times TEXT[], -- Array of preferred time slots
    
    -- Privacy
    profile_visibility visibility_type DEFAULT 'public',
    hide_phone BOOLEAN DEFAULT TRUE,
    hide_last_name BOOLEAN DEFAULT FALSE,
    
    -- Stats (cached for performance)
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0, -- positive for wins, negative for losses
    reliability_rating DECIMAL(2,1) DEFAULT 5.0, -- 1.0 to 5.0
    
    -- Language
    preferred_language language_type DEFAULT 'az',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP
);

-- Rating history table (track ELO changes)
CREATE TABLE rating_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    match_id UUID, -- Will reference matches table (created later)
    old_rating INTEGER NOT NULL,
    new_rating INTEGER NOT NULL,
    rating_change INTEGER NOT NULL,
    reason TEXT, -- 'match_win', 'match_loss', 'admin_adjustment'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blocked users table
CREATE TABLE blocked_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id)
);

-- Indexes for performance
CREATE INDEX idx_users_elo ON users(elo_rating);
CREATE INDEX idx_users_available ON users(availability_status, elo_rating);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(account_status, profile_complete);
CREATE INDEX idx_rating_history_user ON rating_history(user_id, created_at DESC);
CREATE INDEX idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON blocked_users(blocked_id);

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate NTRP from ELO
CREATE OR REPLACE FUNCTION elo_to_ntrp(elo_rating INTEGER)
RETURNS DECIMAL(2,1) AS $$
BEGIN
    RETURN CASE
        WHEN elo_rating < 1000 THEN 1.5
        WHEN elo_rating < 1200 THEN 2.5
        WHEN elo_rating < 1400 THEN 3.5
        WHEN elo_rating < 1600 THEN 4.5
        WHEN elo_rating < 1800 THEN 5.5
        ELSE 6.0
    END;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional - remove in production)
-- Password for all test users: "Test123!"
INSERT INTO users (email, phone, password_hash, first_name, last_name, birth_year, gender, ntrp_initial, email_verified, phone_verified, profile_complete) VALUES
('test1@tennis.az', '+994501234567', '$2a$10$xQZ9J9Z9Z9Z9Z9Z9Z9Z9ZuJZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', 'Rashad', 'Aliyev', 1995, 'male', 3.5, true, true, true),
('test2@tennis.az', '+994501234568', '$2a$10$xQZ9J9Z9Z9Z9Z9Z9Z9Z9ZuJZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', 'Leyla', 'Hasanova', 1998, 'female', 4.0, true, true, true);
