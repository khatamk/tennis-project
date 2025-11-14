# Tennis Platform - Quick Commands Cheat Sheet

## 🚀 First Time Setup

### 1. Database Setup (One Time)
```bash
# Create database
psql -U postgres
CREATE DATABASE tennis_platform;
\q

# Run schema
cd backend
psql -U postgres -d tennis_platform -f config/schema.sql
```

### 2. Backend Setup (One Time)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
```

### 3. Frontend Setup (One Time)
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

---

## 💻 Daily Development Commands

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

### View Database
```bash
psql -U postgres -d tennis_platform
# Then run SQL commands:
SELECT * FROM users;
\dt  # List all tables
\d users  # Describe users table
\q  # Quit
```

---

## 🧪 Testing API with curl

### Register User
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

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@tennis.az",
    "password": "Test123!"
  }'
# Copy the token from response
```

### Get User Info (replace YOUR_TOKEN)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Players
```bash
curl "http://localhost:5000/api/users/search?minRating=1000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Troubleshooting Commands

### Check if PostgreSQL is running
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
# Check Services app for "postgresql" service
```

### Restart PostgreSQL
```bash
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql
```

### Check what's using port 5000
```bash
# macOS/Linux
lsof -i :5000

# Kill process
kill -9 PID_NUMBER
```

### Reset Database (WARNING: Deletes all data)
```bash
psql -U postgres
DROP DATABASE tennis_platform;
CREATE DATABASE tennis_platform;
\q

psql -U postgres -d tennis_platform -f backend/config/schema.sql
```

### View Backend Logs
```bash
cd backend
npm run dev
# All logs appear in terminal
```

### View All Environment Variables
```bash
cd backend
cat .env
```

---

## 📦 Deployment Commands

### Deploy Backend to Railway
```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push

# Railway auto-deploys from GitHub
# Or use Railway CLI:
railway up
```

### Deploy Frontend to Netlify
```bash
cd frontend
npm run build

# Drag 'build' folder to netlify.com
# Or use Netlify CLI:
netlify deploy --prod
```

---

## 🗄️ Useful Database Commands

### View all users
```bash
psql -U postgres -d tennis_platform -c "SELECT id, email, first_name, last_name, elo_rating FROM users;"
```

### Count users
```bash
psql -U postgres -d tennis_platform -c "SELECT COUNT(*) FROM users;"
```

### Delete a user
```bash
psql -U postgres -d tennis_platform -c "DELETE FROM users WHERE email='test@example.com';"
```

### Update user rating
```bash
psql -U postgres -d tennis_platform -c "UPDATE users SET elo_rating=1500 WHERE email='test@example.com';"
```

---

## 🔑 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 Health Checks

### Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"Tennis Platform API is running"}
```

### Database Connection
```bash
psql -U postgres -d tennis_platform -c "SELECT 1;"
# Should return: 1 row
```

### Frontend Running
```bash
# Open browser to http://localhost:3000
# Should see registration page
```

---

## 🚨 Emergency Commands

### Stop all Node processes
```bash
# macOS/Linux
killall node

# Or find and kill specific ones
ps aux | grep node
kill -9 PID
```

### Clear npm cache
```bash
npm cache clean --force
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset Git (if needed)
```bash
git reset --hard HEAD
git clean -fd
```

---

## 📝 Git Commands

### Initial Commit
```bash
git init
git add .
git commit -m "Initial commit - Player profiles feature"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Daily Commits
```bash
git add .
git commit -m "Description of changes"
git push
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL running: `brew services list` or `sudo systemctl status postgresql`
- [ ] Database created: `psql -U postgres -l | grep tennis_platform`
- [ ] Schema loaded: `psql -U postgres -d tennis_platform -c "\dt"`
- [ ] Backend .env configured: `cat backend/.env`
- [ ] Backend running: `curl http://localhost:5000/api/health`
- [ ] Frontend .env configured: `cat frontend/.env`
- [ ] Frontend running: Open `http://localhost:3000`
- [ ] Can register user: Try registration page
- [ ] Can login: Try login page

---

## 🎯 Next Steps After Setup

1. Register a test user
2. Verify phone (check backend logs for code in dev mode)
3. Complete profile
4. Test player search
5. Ready to build Feature #2: Match Scheduling!

---

**Save this file for quick reference!**
