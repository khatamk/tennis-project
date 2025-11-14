# Tennis Platform - Backend API

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Twilio account (for SMS verification)
- AWS account or Cloudinary account (for photo uploads - Phase 2)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE tennis_platform;
\q

# Run schema
psql -U postgres -d tennis_platform -f config/schema.sql
```

#### Option B: AWS RDS PostgreSQL
1. Create RDS PostgreSQL instance on AWS
2. Note the endpoint, username, and password
3. Connect and run schema:
```bash
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d tennis_platform -f config/schema.sql
```

### 4. Environment Variables

Create `.env` file in backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (Local or AWS RDS)
DB_HOST=localhost  # or your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=tennis_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=generate_random_32_character_string_here
JWT_EXPIRE=30d

# Twilio (Sign up at https://www.twilio.com)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (Optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 5. Twilio Setup (Phone Verification)

1. Go to https://www.twilio.com and sign up
2. Get a phone number (trial account gets $15 credit)
3. Copy Account SID, Auth Token, and Phone Number to `.env`
4. **Important**: In development, the code will log verification codes to console if Twilio is not configured

### 6. Run the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 7. Test the API

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@tennis.az",
    "phone": "0501234567",
    "password": "Test123!",
    "firstName": "Rashad",
    "lastName": "Aliyev",
    "birthYear": 1995,
    "gender": "male",
    "ntrpInitial": 3.5
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@tennis.az",
    "password": "Test123!"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-phone` - Verify phone with code
- `POST /api/auth/resend-phone-code` - Resend verification code
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/search` - Search players (protected)
- `POST /api/users/:id/block` - Block user (protected)
- `DELETE /api/users/:id/block` - Unblock user (protected)
- `GET /api/users/blocked/list` - Get blocked users (protected)

## Project Structure

```
backend/
├── config/
│   ├── database.js       # PostgreSQL connection
│   └── schema.sql        # Database schema
├── controllers/
│   ├── authController.js # Authentication logic
│   └── userController.js # User profile logic
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   └── User.js           # User database model
├── routes/
│   ├── auth.js           # Auth routes
│   └── users.js          # User routes
├── utils/
│   ├── jwt.js            # JWT utilities
│   └── sms.js            # Twilio SMS utilities
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
├── package.json          # Dependencies
└── server.js             # Entry point
```

## Deployment (AWS EC2 / Render / Railway)

### AWS EC2
1. Create EC2 instance (Ubuntu)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Set up `.env` with production values
5. Use PM2 to run: `pm2 start server.js`
6. Set up nginx as reverse proxy

### Render (Easier)
1. Connect GitHub repository
2. Select "Web Service"
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in dashboard
6. Connect to managed PostgreSQL database

### Railway (Easiest)
1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Environment variables auto-configured
4. Deploy automatically

## Development Tips

### Testing in Development Mode
- SMS codes will be logged to console if Twilio is not configured
- Use test data in `schema.sql` for quick testing
- Password for test users: `Test123!`

### Common Issues

**Issue**: "relation users does not exist"
**Solution**: Run database schema: `npm run db:init`

**Issue**: "Invalid phone number format"
**Solution**: Ensure phone is in Azerbaijan format (05X XXX XXXX or +994 5X XXX XXXX)

**Issue**: SMS not sending
**Solution**: Check Twilio credentials, or use development mode (codes logged to console)

## Next Steps

1. ✅ User registration and authentication
2. ⏳ Profile photo upload (AWS S3 or Cloudinary)
3. ⏳ Match scheduling system
4. ⏳ Tournament management
5. ⏳ Messaging system
6. ⏳ Rating/ELO updates after matches

## Support

For issues or questions, check:
- Database logs: `tail -f /var/log/postgresql/postgresql.log`
- Server logs: `npm run dev` shows live logs
- API testing: Use Postman or curl
