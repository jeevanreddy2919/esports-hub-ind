# 🎮 India Esports Hub

India's premier esports platform for Indian gamers — live tournaments, leaderboards, AI chatbot, and more!

## 🚀 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | SQLite (file-based, zero config) |
| AI Chatbot | Google Gemini API |
| Deploy Frontend | Vercel |
| Deploy Backend | Render |

---

## 🖥️ Local Development

### 1. Start Backend
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Deployment Guide

### Deploy Backend → Render (Free)

1. Go to [render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo, select the `backend` folder
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `backend`
5. Add Environment Variables:
   | Key | Value |
   |---|---|
   | `PORT` | `5000` |
   | `JWT_SECRET` | `your_secret_key_here` |
   | `GEMINI_API_KEY` | `your_gemini_api_key` (optional) |
   | `FRONTEND_URL` | `*` |
6. Click **Deploy** — copy the URL (e.g. `https://esports-hub-india.onrender.com`)

### Deploy Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New Project**
3. Connect your GitHub repo, select the `frontend` folder
4. Set these settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-render-url.onrender.com` |
6. Click **Deploy** 🚀

---

## 🤖 AI Chatbot Setup (Optional)

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create a free API key
3. Add it to your Render environment variables as `GEMINI_API_KEY`
4. The chatbot works in fallback mode without it!

---

## 📁 Project Structure

```
esports hub ind/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── pages/     # Home, Login, Signup, Tournaments, Leaderboard, Profile
│   │   ├── components/ # Navbar, ChatBot, ParticleBackground
│   │   ├── context/   # AuthContext (JWT)
│   │   └── services/  # API service layer
│   └── vercel.json
├── backend/           # Node.js + Express
│   ├── routes/        # auth, tournaments, chat, leaderboard
│   ├── db/            # SQLite + seeded data
│   └── server.js
└── README.md
```

## 🎯 Features

- ✅ Login / Signup with JWT auth
- ✅ 8 pre-seeded Indian esports tournaments (BGMI, Valorant, Free Fire, CS2, Chess, MLBB, Tekken 8)
- ✅ Live / Upcoming / Past tournament filters
- ✅ Tournament registration system
- ✅ Leaderboard with gold/silver/bronze podium
- ✅ Player profile dashboard
- ✅ AI chatbot (GameGuru) with Gemini + smart fallback
- ✅ Animated particle background
- ✅ Mobile responsive
- ✅ Neon cyberpunk UI with glassmorphism
