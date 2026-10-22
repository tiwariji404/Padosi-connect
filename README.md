# 🏘️ PadosiConnect - Hyperlocal Neighborhood Community Platform

A modern, full-stack community web platform built exclusively with **React.js**, **JavaScript**, **Node.js**, **Express.js**, and **Firebase**.

---

## 🚀 Tech Stack

- **Frontend**: [React.js](https://react.dev/) + [Vite](https://vite.dev/) + Modern Vanilla CSS (No bulky frameworks, rich custom design system)
- **Language**: JavaScript (ES Modules)
- **Backend**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) REST API
- **Authentication & Database**: [Firebase](https://firebase.google.com/) (Firebase Auth + Firestore integration with local seamless fallback)

---

## ✨ Features

1. **📢 Society Noticeboard**:
   - Official circulars, water/power outage announcements, and AGM alerts.
   - Resident posts, carpooling requests, queries, likes, and live threaded comments.
2. **🌆 City Pulse**:
   - Hyperlocal city feed for Raipur (traffic alerts, local food spots, doctor recommendations).
3. **💬 Neighborhood Discussion Groups**:
   - Live group chats (General Chat, Gardening Club, Raipur Foodies, Sports Club).
   - Real-time messages with sender tags, timestamps, and custom group creation.
4. **🩸 Emergency Blood Donor Directory**:
   - Filter by blood group (A+, B+, O+, AB+, O-, etc.).
   - Resident donor contacts, availability status, and 1-tap **Urgent Blood Broadcast**.
5. **🔄 Hyperlocal Borrow & Buy Marketplace**:
   - Borrow heavy tools (drills, ladders), books, or buy/sell household items within your society.
6. **🛠️ Verified Society Services**:
   - Electricians, plumbers, AC technicians, housekeepers, security desks with ratings and direct calling.
7. **🚨 SOS Emergency Alert System**:
   - 1-tap emergency panic button with loud visual siren animation for Medical, Fire, Lift Stuck, or Intruder emergencies.
   - Broadcasts immediate alert across society towers with resident name and flat number.
8. **🔥 Firebase Authentication**:
   - Sign in with Google, Email/Password, or 1-Click Demo Resident mode.
   - Profile management with flat number, society name, and verification badges.

---

## 🛠️ Project Structure

```text
padosiconnect/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js          # Express.js REST API with full endpoints
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api.js         # API client connecting frontend to backend
│       ├── firebase.js    # Firebase Auth & Firestore service wrapper
│       ├── index.css      # Modern Glassmorphic CSS design system
│       ├── App.jsx        # Main application layout & state
│       └── components/    # Modular React components & views
│           ├── Navbar.jsx
│           ├── Sidebar.jsx
│           ├── SOSBanner.jsx
│           ├── SOSModal.jsx
│           ├── AuthModal.jsx
│           ├── NewPostModal.jsx
│           ├── NoticeboardView.jsx
│           ├── CityPulseView.jsx
│           ├── CommunityChatsView.jsx
│           ├── BloodBankView.jsx
│           ├── MarketplaceView.jsx
│           ├── ServicesView.jsx
│           ├── SOSAlertCenterView.jsx
│           └── ProfileView.jsx
├── package.json           # Root orchestrator scripts
└── README.md
```

---

## 🏃 Getting Started

### 1. Run Everything Concurrently

```bash
# Start backend (Port 5000)
npm run backend

# In another terminal, start frontend (Port 5173)
npm run frontend
```

The web application will open at:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### 2. Configure Firebase (Optional)

Copy `frontend/.env.example` to `frontend/.env` and insert your Firebase Project credentials from the Firebase Console. If not provided, PadosiConnect will run in seamless Demo Mode so you can test all features immediately without any setup!
