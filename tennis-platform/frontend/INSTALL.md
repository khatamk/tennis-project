# Frontend Files - Installation Guide

## 📂 File Structure

Copy these files to your frontend folder:

```
frontend/
├── package.json              (root of frontend folder)
├── postcss.config.js         (root of frontend folder)
├── tailwind.config.js        (already exists)
├── .env                      (root of frontend folder)
├── .gitignore                (root of frontend folder)
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── index.css
    ├── App.js
    ├── api/
    │   └── api.js            (already exists)
    ├── store/
    │   └── authStore.js      (already exists)
    └── pages/
        ├── RegisterPage.jsx  (already exists)
        ├── LoginPage.jsx
        └── DashboardPage.jsx
```

## 📥 Where to Place Each File

### Root Files (in `C:\Users\kamra\Documents\Tennis-Project\tennis-platform\frontend\`)
- `package.json`
- `postcss.config.js`
- `.env`
- `.gitignore`

### Public Folder Files (in `frontend\public\`)
- `index.html`

### Src Folder Files (in `frontend\src\`)
- `index.js`
- `index.css`
- `App.js`

### Src Pages Folder (in `frontend\src\pages\`)
- `LoginPage.jsx`
- `DashboardPage.jsx`

## 🚀 After Copying All Files

```bash
# Navigate to frontend folder
cd C:\Users\kamra\Documents\Tennis-Project\tennis-platform\frontend

# Install dependencies
npm install

# Start the application
npm start
```

## ✅ Verify Installation

1. Backend should be running on http://localhost:5000
2. Frontend should open on http://localhost:3000
3. You should see the registration page

## 🎯 Test Flow

1. Register a new user
2. Check backend terminal for verification code
3. Enter code to verify phone
4. Login with your credentials
5. See the dashboard!

## 🆘 Common Issues

**"Cannot find module"**
- Make sure you ran `npm install`

**"Port 3000 already in use"**
- Close any other apps using port 3000
- Or kill the process: `npx kill-port 3000`

**"Failed to compile"**
- Check all files are in correct folders
- Make sure no syntax errors in copied files

## 📞 Need Help?

Check that:
1. All files are copied to correct folders
2. Backend is running (http://localhost:5000/api/health)
3. Database is set up
4. `.env` file exists with correct API URL
