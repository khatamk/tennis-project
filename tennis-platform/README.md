# 🎾 Tennis Platform - Amateur Tennis Community for Baku

## Welcome! 👋

This is a complete tennis community platform designed specifically for amateur tennis players in Baku, Azerbaijan. We've just completed **Feature #1: Player Profiles** with full authentication, ELO rating system, and player discovery.

---

## 📦 What's Included

This package contains everything you need to get started:

### 📁 **Code & Structure**
- ✅ Complete **Backend API** (Node.js + Express + PostgreSQL)
- ✅ **Frontend Foundation** (React + Tailwind CSS)
- ✅ **Database Schema** (PostgreSQL with all tables)
- ✅ **Authentication System** (JWT + Phone/Email verification)
- ✅ **ELO Rating System** (Starts at 1000, auto-updates)

### 📚 **Documentation**
1. **SETUP_GUIDE.md** - Complete installation instructions
2. **QUICK_COMMANDS.md** - Command cheat sheet for daily use
3. **PROJECT_STATUS.md** - What's done, what's next
4. **ARCHITECTURE.md** - System design and data flows
5. **Backend README** - Specific backend documentation
6. **Frontend README** - Frontend development guide

---

## 🚀 Quick Start (15 Minutes)

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org))
- PostgreSQL 12+ ([Download](https://www.postgresql.org))
- Git ([Download](https://git-scm.com))

### 1. Database Setup
```bash
# Create database
psql -U postgres
CREATE DATABASE tennis_platform;
\q

# Load schema
cd backend
psql -U postgres -d tennis_platform -f config/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
# Frontend opens on http://localhost:3000
```

### 4. Test It!
- Open http://localhost:3000
- Register a new user
- Check backend terminal for verification code
- Verify phone and login
- Success! 🎉

**Detailed instructions**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## ✅ Feature #1: Player Profiles (COMPLETE)

### What We Built

**User Management:**
- Registration with phone & email verification
- Login/logout with JWT authentication
- Profile creation and editing
- Privacy controls (hide phone, hide last name)
- User blocking system

**Rating System:**
- ELO rating (starts at 1000)
- NTRP skill level mapping (1.0-7.0)
- Provisional rating period (first 10 matches)
- Rating history tracking
- Auto-adjustment based on match results

**Player Discovery:**
- Search players by rating, format, availability
- Filter by gender, skill level
- View public profiles
- Reliability ratings
- Activity status

**Technical Highlights:**
- RESTful API with 10+ endpoints
- PostgreSQL database with optimized indexes
- SMS verification via Twilio
- Secure password hashing (bcrypt)
- JWT token authentication
- State management (Zustand)
- Responsive UI (Tailwind CSS)

---

## 📋 Coming Next

### Feature #2: Match Scheduling (2-3 days)
- Create and invite players to matches
- Select date, time, and court
- Match confirmation system
- Score submission
- Match history

### Feature #3: Court Finder (1-2 days)
- Directory of Baku tennis courts
- Court details and photos
- Availability calendar
- Booking integration
- Map with directions

### Feature #4: Tournament Management (3-4 days)
- Create tournaments (elimination, round-robin, ladder)
- Player registration
- Automated bracket generation
- Live scoring
- Standings and leaderboards

### Feature #5: Messaging System (2-3 days)
- In-app chat
- Match discussions
- Push notifications
- Read receipts

### Feature #6: Rating Updates (1-2 days)
- Automatic ELO calculation after matches
- Performance analytics
- Global/local leaderboards
- Achievement badges

---

## 🎯 Competitive Advantages

### vs. liga.tennis.az
✅ **Self-service platform** (no manual WhatsApp coordination)
✅ **Flexible match formats** (not just monthly leagues)
✅ **Modern UX/UI** (mobile-first design)
✅ **Lower barrier to entry** (freemium model)
✅ **Automated everything** (no admin bottlenecks)

### vs. tennisfriends.az
✅ **Rich social features** (profiles, activity feed)
✅ **Tournament management** (multiple formats)
✅ **Court booking integration**
✅ **Advanced analytics**
✅ **Mobile apps** (React Native - Phase 2)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **SMS**: Twilio
- **File Storage**: AWS S3 or Cloudinary (Phase 2)

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Routing**: React Router
- **HTTP**: Axios
- **UI**: Toast notifications, responsive design

### DevOps
- **Backend Hosting**: Railway / Render / AWS EC2
- **Frontend Hosting**: Netlify / Vercel
- **Database**: Railway PostgreSQL / AWS RDS
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (optional)

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-phone` - Verify phone with SMS code
- `POST /api/auth/resend-phone-code` - Resend verification
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search players
- `POST /api/users/:id/block` - Block user
- `DELETE /api/users/:id/block` - Unblock user
- `GET /api/users/blocked/list` - Get blocked users

**More endpoints coming with Features 2-6**

---

## 📁 Project Structure

```
tennis-platform/
├── backend/                     # Backend API
│   ├── config/
│   │   ├── database.js         # PostgreSQL connection
│   │   └── schema.sql          # Database schema
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth, validation
│   ├── models/                 # Database queries
│   ├── routes/                 # API endpoints
│   ├── utils/                  # Helpers (JWT, SMS)
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/               # API configuration
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── store/             # State management
│   │   └── utils/             # Helper functions
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── SETUP_GUIDE.md             # Setup instructions
├── QUICK_COMMANDS.md          # Command reference
├── PROJECT_STATUS.md          # Project status
├── ARCHITECTURE.md            # System architecture
└── README.md                  # This file
```

---

## 💰 Cost Estimate

### Development (FREE)
- Railway free tier
- Netlify free tier
- PostgreSQL free tier
- Twilio trial ($15 credit)
- **Total: $0/month**

### Production (Small Scale <1000 users)
- Backend: $5/month
- Frontend: Free (or $19 for pro)
- Database: $5/month
- SMS: ~$50/month
- **Total: ~$60-80/month**

### Production (Large Scale >5000 users)
- Backend: $30/month
- Frontend: $19/month
- Database: $15/month
- SMS: $100-200/month
- **Total: ~$170-270/month**

---

## 🧪 Testing

### Quick Health Check
```bash
# Backend
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Tennis Platform API is running"}
```

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@tennis.az",
    "phone": "0501234567",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "birthYear": 1995,
    "gender": "male",
    "ntrpInitial": 3.5
  }'
```

**More tests**: See [QUICK_COMMANDS.md](QUICK_COMMANDS.md)

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete installation guide for all platforms |
| [QUICK_COMMANDS.md](QUICK_COMMANDS.md) | Command cheat sheet for daily development |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current status and roadmap |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design and architecture |
| [backend/README.md](backend/README.md) | Backend-specific documentation |

---

## 🚀 Deployment

### Option 1: Railway (Easiest)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Add PostgreSQL plugin
5. Add environment variables
6. Deploy! ✨

### Option 2: AWS (Advanced)
- Full control
- More configuration
- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed steps

### Option 3: Render
- Easy setup
- Free tier available
- Managed PostgreSQL

**Detailed deployment**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) section "Deployment Guide"

---

## 🆘 Need Help?

### Common Issues

**"Cannot connect to database"**
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Restart if needed
brew services restart postgresql
```

**"Port already in use"**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**"SMS not sending"**
- In development, codes are logged to console
- Check backend terminal for verification codes
- No Twilio needed for local development

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**More solutions**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) "Common Issues"

---

## 📈 Roadmap

### ✅ Phase 1: MVP Foundation (COMPLETE - 3 days)
- [x] Player profiles
- [x] Authentication system
- [x] ELO rating system
- [x] Player discovery

### ⏳ Phase 2: Core Features (12 days)
- [ ] Match scheduling
- [ ] Court finder
- [ ] Tournament management
- [ ] Basic messaging

### 🔮 Phase 3: Enhancement (10 days)
- [ ] Advanced analytics
- [ ] Mobile apps (React Native)
- [ ] Performance graphs
- [ ] Achievement system

### 🚀 Phase 4: Growth (Ongoing)
- [ ] Coach marketplace
- [ ] Equipment shop
- [ ] Social feed
- [ ] Team management

---

## 👥 Team & Contributions

**Current Status**: Solo development
**Looking for**: Beta testers, feedback, contributors

**How to contribute**:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

---

## 📄 License

MIT License - Feel free to use for your own tennis community!

---

## 🎾 Let's Play Tennis!

Ready to build the best tennis community platform in Azerbaijan?

1. **Today**: Set up local environment
2. **This Week**: Test Feature #1
3. **Next Week**: Build Feature #2 (Match Scheduling)
4. **This Month**: Complete MVP
5. **Launch**: Start onboarding players!

---

## 📞 Questions?

- Check documentation files first
- Review code comments
- Test with curl commands
- Inspect database tables

**Next Steps**: 
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Set up local environment
3. Test everything works
4. Ready to build Feature #2!

---

**Built with ❤️ for the Baku tennis community**

Version 1.0 - Feature #1 Complete ✅
Last Updated: November 2024
