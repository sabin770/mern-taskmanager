# 🚀 TaskFlow — Full-Stack MERN Task Manager

A production-ready task management application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 📁 Project Structure

```
mern-taskmanager/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt + JWT)
│   │   └── Task.js             # Task schema
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Profile
│   │   └── tasks.js            # Full CRUD for tasks
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js       # Top navigation bar
│       │   ├── StatsBar.js     # Task statistics & progress
│       │   ├── Filters.js      # Search, filter, sort controls
│       │   ├── TaskCard.js     # Individual task card
│       │   ├── TaskModal.js    # Create/Edit task modal
│       │   └── PrivateRoute.js # Auth-protected route wrapper
│       ├── context/
│       │   └── AuthContext.js  # Auth state management
│       ├── hooks/
│       │   └── useTasks.js     # Task CRUD custom hook
│       ├── pages/
│       │   ├── AuthPage.js     # Login / Register page
│       │   └── Dashboard.js    # Main task dashboard
│       ├── utils/
│       │   └── api.js          # Axios instance + interceptors
│       ├── App.js              # Router + global providers
│       ├── index.js            # React entry point
│       └── index.css           # Global styles & design tokens
│
├── package.json                # Root — runs both servers
└── README.md
```

---

## ✨ Features

### Backend
- **JWT Authentication** — Register, login, protected routes
- **Password Hashing** — bcryptjs with salt rounds
- **Full Task CRUD** — Create, Read, Update, Delete tasks
- **Filtering & Search** — Filter by status, priority; search by title/description
- **Task Stats** — Per-user counts by status
- **Input Validation** — express-validator on all routes
- **Error Handling** — Centralized error middleware
- **MongoDB Indexes** — Optimized queries for user tasks

### Frontend
- **Auth Flow** — Login/Register with JWT stored in localStorage
- **Dashboard** — Grid of task cards with live stats
- **Filters** — Status tabs, priority dropdown, sort, search
- **Task Modal** — Create/Edit with full form validation
- **Progress Bar** — Visual completion percentage
- **Toast Notifications** — Success/error feedback
- **Responsive** — Works on desktop and mobile

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local) or a [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd mern-taskmanager
npm run install-all
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_taskmanager
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=30d
```

### 3. Run Development Servers
From the root directory:
```bash
npm run dev
```
This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List tasks (with filters) | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| PATCH | `/api/tasks/:id/status` | Update status only | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| DELETE | `/api/tasks` | Delete all completed | ✅ |

### Query Parameters (GET /api/tasks)
```
?status=todo|in-progress|completed
?priority=low|medium|high
?search=keyword
?sort=-createdAt|createdAt|dueDate|-priority
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Frontend | React 18 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Dates | date-fns |
| Fonts | Google Fonts (Syne + DM Sans) |

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`)
2. Set start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Build: `npm run build`
2. Set `REACT_APP_API_URL=https://your-backend-url.com/api`

---

## 📝 License
MIT
