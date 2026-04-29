# 💼 Hirely — Full Stack Job Portal
> Built with React + Node.js + MongoDB | By **Shaurya Singh**

---

## 📁 Project Structure

```
hirely/
├── backend/
│   ├── server.js               ← Express entry point (all routes)
│   ├── seed.js                 ← Seeds 12 sample jobs into MongoDB
│   ├── .env.example            ← Copy → .env, add your MongoDB URI
│   ├── config/db.js            ← MongoDB connection
│   ├── models/
│   │   ├── User.js             ← Auth schema
│   │   ├── Job.js              ← Job listing schema
│   │   ├── Application.js      ← Applied jobs
│   │   └── SavedJob.js         ← Bookmarked jobs
│   ├── routes/
│   │   ├── auth.js             ← Register / Login / Me
│   │   ├── jobs.js             ← List jobs / Single job
│   │   └── applications.js     ← Apply / Save / Get lists
│   └── middleware/auth.js      ← JWT verification
│
└── frontend/
    ├── public/index.html       ← HTML template + splash loader
    └── src/
        ├── index.js            ← React root
        ├── App.jsx             ← Router + global state
        ├── index.css           ← CSS variables + all keyframes
        ├── utils/api.js        ← Axios (auto JWT headers)
        ├── context/
        │   ├── AuthContext.jsx ← Global auth state
        │   └── ThemeContext.jsx← Dark/Light mode
        ├── hooks/useToast.js   ← Toast system
        ├── components/
        │   ├── Navbar.jsx      ← Nav + auth dropdown + theme
        │   ├── BackgroundEffects.jsx ← Orbs, grid, cursor glow
        │   ├── JobCard.jsx     ← Animated card + bookmark
        │   ├── JobModal.jsx    ← Job details popup
        │   ├── SkeletonCard.jsx← Shimmer loading card
        │   └── Toast.jsx       ← Notification popups
        └── pages/
            ├── Home.jsx        ← Hero + search + grid + pagination
            ├── Profile.jsx     ← Saved + applied dashboard
            ├── SignIn.jsx      ← Login form
            └── GetStarted.jsx  ← Register form
```

---

## 🚀 How to Run

### 1. Backend

```bash
cd hirely/backend
npm install
cp .env.example .env
# → Edit .env: add your MONGO_URI from MongoDB Atlas
node seed.js        # fills DB with 12 jobs
npm run dev         # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd hirely/frontend
npm install
npm start           # opens http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Endpoint            | Auth | What it does               |
|--------|---------------------|------|----------------------------|
| POST   | /api/auth/register  | No   | Create account             |
| POST   | /api/auth/login     | No   | Login, returns JWT         |
| GET    | /api/auth/me        | Yes  | Get logged-in user         |
| GET    | /api/jobs           | No   | List + search + filter     |
| GET    | /api/jobs/:id       | No   | Single job details         |
| POST   | /api/apply          | Yes  | Apply to a job             |
| GET    | /api/applications   | Yes  | Your applications          |
| POST   | /api/save           | Yes  | Toggle save/unsave         |
| GET    | /api/saved          | Yes  | Your saved jobs            |

**Search params:** `?q=react&location=Remote&type=Full-time&page=1&limit=6`

---

## ✨ Features

**UI / Frontend**
- Dark + Light mode with localStorage persistence
- Animated background — moving grid, floating orbs, cursor glow
- Job cards with hover lift, shimmer sweep, color top-border animation
- Skeleton shimmer loading cards
- Real-time debounced search (title / company / tags)
- Quick filter tabs (All, Remote, Full-time, Contract, Part-time)
- Location + job type dropdowns
- Load More pagination
- Job details modal (slide-up animation)
- Toast notifications (success / info / error)
- Empty state with floating animation
- Scroll-to-top button
- Fully responsive (mobile + desktop)
- Register / Sign In / Sign Out with JWT

**Backend**
- JWT auth with 30-day expiry
- Password hashing with bcryptjs
- Mongoose schemas with validation + indexes
- Duplicate apply/save prevention
- Regex search across title, company, tags
- Pagination with page + limit
- View counter on job fetch

---

## 🛠️ Tech Stack

| Part      | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| Styling   | CSS Variables + inline styles     |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB + Mongoose                |
| Auth      | JWT + bcryptjs                    |
| Fonts     | Plus Jakarta Sans (Google Fonts)  |

---

## 📸 Routes

| URL            | Page        |
|----------------|-------------|
| `/`            | Browse Jobs |
| `/profile`     | My Dashboard|
| `/signin`      | Sign In     |
| `/get-started` | Register    |

---

*Made with ❤️ by Shaurya Singh*
