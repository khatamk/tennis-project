# Tennis Platform - Complete Setup Guide

## 🎾 Project Overview

A modern tennis community platform for Baku, Azerbaijan that allows players to:
- Create profiles with ELO ratings
- Find and match with other players
- Schedule matches
- Organize tournaments
- Track performance and stats

---

## 📋 What We've Built So Far

### ✅ Feature #1: Player Profiles (COMPLETE)
- User registration with phone/email verification
- ELO rating system (starting at 1000)
- Profile customization
- Privacy controls
- Player search and discovery

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js** (v16+): https://nodejs.org
2. **PostgreSQL** (v12+): https://www.postgresql.org
3. **Git**: https://git-scm.com
4. **Code Editor**: VS Code recommended

### Step 1: Database Setup (15 minutes)

#### Option A: Local PostgreSQL (Development)
```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Install PostgreSQL (Windows)
# Download from https://www.postgresql.org/download/windows/

# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
psql -U postgres
CREATE DATABASE tennis_platform;
\q

# Run schema
cd backend
psql -U postgres -d tennis_platform -f config/schema.sql
```

#### Option B: AWS RDS (Production)
```bash
# 1. Go to AWS Console → RDS
# 2. Create Database → PostgreSQL
# 3. Choose Free Tier (for testing)
# 4. Note endpoint, username, password
# 5. Allow inbound traffic in Security Group (port 5432)
# 6. Connect and run schema:
psql -h your-endpoint.rds.amazonaws.com -U postgres -d tennis_platform -f backend/config/schema.sql
```

### Step 2: Backend Setup (10 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use any text editor
```

**Required .env values:**
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost  # or RDS endpoint
DB_PORT=5432
DB_NAME=tennis_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT (generate random string)
JWT_SECRET=your_random_32_char_string_here
JWT_EXPIRE=30d

# Twilio (sign up at twilio.com - free trial)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Frontend
FRONTEND_URL=http://localhost:3000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Start backend:**
```bash
npm run dev  # Development mode
# Server runs on http://localhost:5000
```

**Test it works:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"Tennis Platform API is running"}
```

### Step 3: Frontend Setup (10 minutes)

```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm start
# Opens http://localhost:3000 in browser
```

---

## 🌐 Deployment Guide

### Backend Deployment Options

#### Option 1: Railway (Easiest - 5 minutes)
```bash
# 1. Go to railway.app and sign up
# 2. New Project → Deploy from GitHub
# 3. Connect your repository
# 4. Add PostgreSQL plugin (auto-configures DATABASE_URL)
# 5. Add environment variables in dashboard
# 6. Deploy! Railway provides HTTPS URL automatically
```

#### Option 2: Render (Easy - 10 minutes)
```bash
# 1. Go to render.com and sign up
# 2. New → Web Service
# 3. Connect GitHub repository
# 4. Build Command: npm install
# 5. Start Command: npm start
# 6. Add environment variables
# 7. Create PostgreSQL database (managed)
# 8. Deploy! Free tier available
```

#### Option 3: AWS EC2 (Advanced - 30 minutes)
```bash
# 1. Launch EC2 instance (Ubuntu)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# 5. Clone repository
git clone your-repo-url
cd tennis-platform/backend

# 6. Install dependencies
npm install

# 7. Set up .env with production values

# 8. Install PM2 (process manager)
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save

# 9. Set up nginx reverse proxy
sudo apt install nginx
# Configure nginx to proxy :80 to :5000

# 10. Set up SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdo main.com
```

### Frontend Deployment - Netlify (5 minutes)

```bash
# 1. Build production version
cd frontend
npm run build

# 2. Go to netlify.com and sign up
# 3. Drag and drop the 'build' folder
# 4. Or connect GitHub for automatic deploys
# 5. Add environment variable:
#    REACT_APP_API_URL=https://your-backend-url.railway.app/api
# 6. Deploy! Netlify provides HTTPS + CDN
```

---

## 📊 Current API Endpoints

### Authentication
```bash
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
POST   /api/auth/verify-phone      # Verify phone with SMS code
POST   /api/auth/resend-phone-code # Resend verification code
GET    /api/auth/me                # Get current user
POST   /api/auth/logout            # Logout
```

### Users
```bash
GET    /api/users/:id              # Get user profile
PUT    /api/users/profile          # Update profile
GET    /api/users/search           # Search players
POST   /api/users/:id/block        # Block user
DELETE /api/users/:id/block        # Unblock user
GET    /api/users/blocked/list     # Get blocked users
```

---

## 🧪 Testing the API

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rashad@tennis.az",
    "phone": "0501234567",
    "password": "Test123!",
    "firstName": "Rashad",
    "lastName": "Aliyev",
    "birthYear": 1995,
    "gender": "male",
    "ntrpInitial": 3.5
  }'

# Response includes token and verification code (in dev mode)
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "rashad@tennis.az",
    "password": "Test123!"
  }'

# Save the token from response
export TOKEN="your_token_here"
```

### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Search Players
```bash
curl "http://localhost:5000/api/users/search?minRating=1000&maxRating=1500" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Project Structure

```
tennis-platform/
├── backend/
│   ├── config/
│   │   ├── database.js       # PostgreSQL connection
│   │   └── schema.sql        # Database schema
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── userController.js # User operations
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── models/
│   │   └── User.js           # User database model
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   └── users.js          # User routes
│   ├── utils/
│   │   ├── jwt.js            # JWT utilities
│   │   └── sms.js            # Twilio SMS
│   ├── .env                  # Environment variables (create this)
│   ├── .env.example          # Environment template
│   ├── package.json
│   ├── server.js             # Entry point
│   └── README.md
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── api.js        # API configuration
    │   ├── components/       # Reusable components
    │   ├── pages/            # Page components
    │   ├── store/
    │   │   └── authStore.js  # Global state
    │   ├── utils/            # Helper functions
    │   └── App.js
    ├── .env                  # Frontend environment
    ├── package.json
    ├── tailwind.config.js
    └── README.md
```

---

## 🔧 Common Issues & Solutions

### Issue: "relation users does not exist"
```bash
# Solution: Run database schema
cd backend
psql -U postgres -d tennis_platform -f config/schema.sql
```

### Issue: "Cannot connect to database"
```bash
# Solution: Check PostgreSQL is running
# macOS:
brew services list
brew services restart postgresql@14

# Linux:
sudo systemctl status postgresql
sudo systemctl restart postgresql

# Check .env has correct credentials
```

### Issue: "SMS not sending"
```bash
# Solution: In development mode, codes are logged to console
# Check terminal running backend for verification codes
# Or sign up for Twilio free trial (no credit card for testing)
```

### Issue: "Port 5000 already in use"
```bash
# Solution: Kill process or change port
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env to 5001
```

### Issue: "CORS error in frontend"
```bash
# Solution: Make sure backend is running
# Check REACT_APP_API_URL in frontend/.env matches backend URL
```

---

## 📈 What's Next (Feature #2-6)

### Upcoming Features:
1. ✅ **Player Profiles** (COMPLETE)
2. ⏳ **Match Scheduling** (Next)
3. ⏳ **Court Finder**
4. ⏳ **Tournament Management**
5. ⏳ **Messaging System**
6. ⏳ **Rating Updates**

---

## 💰 Cost Estimate

### Development/Testing (FREE)
- Backend: Railway/Render free tier
- Frontend: Netlify free tier
- Database: Railway PostgreSQL (free)
- SMS: Twilio free trial ($15 credit)
- **Total: $0/month**

### Production (Small Scale <1000 users)
- Backend: Railway Pro ($5/month)
- Frontend: Netlify Pro ($19/month) - optional
- Database: Railway PostgreSQL ($5/month)
- SMS: Twilio (~$0.01/SMS = ~$50/month for 5000 SMS)
- **Total: ~$60-80/month**

### Production (Large Scale >5000 users)
- Backend: AWS EC2 t3.medium ($30/month)
- Frontend: Netlify/AWS CloudFront ($19/month)
- Database: AWS RDS PostgreSQL ($15/month)
- SMS: Twilio ($100-200/month)
- **Total: ~$170-270/month**

---

## 🆘 Support & Next Steps

### Ready to Continue?
Once you have the backend and frontend running locally, we'll build:
1. Registration/Login UI screens
2. Profile page with editing
3. Player search and discovery
4. Then move to Feature #2: Match Scheduling

### Need Help?
- Check backend logs: `npm run dev` (shows all errors)
- Check frontend console: Open browser DevTools (F12)
- Test API with curl or Postman
- Verify database with: `psql -U postgres -d tennis_platform`

---

## 📝 Important Notes

- **Phone Numbers**: System expects Azerbaijan format (+994 50/51/55/70/77/99 XXX XXXX)
- **ELO Rating**: Starts at 1000, updates automatically after matches
- **Verification**: In dev mode, SMS codes logged to console
- **Security**: Change JWT_SECRET in production
- **Backup**: Always backup database before schema changes

---

**Questions? Let me know and we'll tackle them together!**
