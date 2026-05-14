```markdown
# 🚀 TaskFlow — Full-Stack MERN Task Manager with Premium Features

A production-ready task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring **Khalti payment integration** and **premium user benefits**.

---

## 📸 Screenshots

### Dashboard View
![](Screenshots/login.png)

### Dashboard View
![](Screenshots/dashboard.png)

### Premium Payment Page
![](Screenshots/premium-page.png)

### Khalti Payment Gateway
![](Screenshots/khalti-payment.png)

### Premium Activated Page
![](Screenshots/premium-activated.png)

### Premium History Page
![](Screenshots/premium-history-page.png)

### Email Notification 
![](Screenshots/email.png)


---

## 📁 Project Structure


mern-taskmanager/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication middleware
│   │   └── errorHandler.js          # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema (bcrypt + JWT)
│   │   ├── Task.js                  # Task schema
│   │   └── Payment.js               # Payment transaction history
│   ├── routes/
│   │   ├── auth.js                  # Register, Login, Profile
│   │   ├── tasks.js                 # Full CRUD for tasks
│   │   └── payment.js               # Khalti payment routes
│   ├── services/
│   │   ├── emailService.js          # Email notifications
│   │   ├── khaltiService.js         # Khalti API integration
│   │   └── reminderCron.js          # Task reminder cron jobs
│   ├── .env.example                 # Environment variable template
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js            # Top navigation bar
│       │   ├── StatsBar.js          # Task statistics & progress
│       │   ├── Filters.js           # Search, filter, sort controls
│       │   ├── TaskCard.js          # Individual task card
│       │   ├── TaskModal.js         # Create/Edit task modal
│       │   ├── PrivateRoute.js      # Auth-protected route wrapper
│       │   └── PremiumBadge.js      # Premium user badge component
│       ├── context/
│       │   └── AuthContext.js       # Auth state management
│       ├── hooks/
│       │   ├── useTasks.js          # Task CRUD custom hook
│       │   └── usePremium.js        # Premium features hook
│       ├── pages/
│       │   ├── AuthPage.js          # Login / Register page
│       │   ├── Dashboard.js         # Main task dashboard
│       │   ├── PremiumPage.js       # Premium subscription page
│       │   └── KhaltiCallback.js    # Payment verification callback
│       ├── utils/
│       │   └── api.js               # Axios instance + interceptors
│       ├── App.js                   # Router + global providers
│       ├── index.js                 # React entry point
│       └── index.css                # Global styles & design tokens
│
├── screenshots/                      # 📸 Add your images here
│   ├── dashboard.png
│   ├── premium-page.png
│   ├── khalti-payment.png
│   └── task-modal.png
│
├── package.json                      # Root — runs both servers
└── README.md


---

## ✨ Features

### Backend Features
- **JWT Authentication** — Register, login, protected routes
- **Password Hashing** — bcryptjs with salt rounds
- **Full Task CRUD** — Create, Read, Update, Delete tasks
- **Filtering & Search** — Filter by status, priority; search by title/description
- **Task Stats** — Per-user counts by status
- **Khalti Payment Integration** — Premium subscription with payment verification
- **Email Notifications** — Welcome emails, payment confirmations, task reminders
- **Cron Jobs** — Automated task reminders via email
- **Payment Tracking** — Store all payment transactions
- **Premium Features** — Unlock exclusive features after payment

### Premium Features (After Payment)
- 🎯 **Unlimited Tasks** — No task creation limits
- 📊 **Advanced Analytics** — Detailed productivity insights
- 🔔 **Email Reminders** — Automatic task deadline reminders
- 🏷️ **Priority Support** — Faster email responses
- ✨ **Premium Badge** — Visible badge on profile

### Frontend Features
- **Auth Flow** — Login/Register with JWT stored in localStorage
- **Dashboard** — Grid of task cards with live stats
- **Filters** — Status tabs, priority dropdown, sort, search
- **Task Modal** — Create/Edit with full form validation
- **Progress Bar** — Visual completion percentage
- **Toast Notifications** — Success/error feedback
- **Premium Page** — View premium plans and payment options
- **Khalti Integration** — Seamless payment gateway integration
- **Responsive** — Works on desktop and mobile

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local) or [MongoDB Atlas](https://cloud.mongodb.com)
- Khalti Merchant Account (for payment integration)

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

# Khalti Payment Keys
KHALTI_SECRET_KEY=test_secret_key_your_key_here
KHALTI_PUBLIC_KEY=test_public_key_your_key_here

# Email Configuration (for reminders)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Run Development Servers
From the root directory:
```bash
npm run dev
```
This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

### 4. Test Payment (Khalti Test Mode)
Use Khalti test credentials:
- **Phone:** 9800000005
- **Password:** 1111 
- **OTP:** 98765

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

### Payment
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payment/initiate` | Initiate Khalti payment | ✅ |
| GET | `/api/payment/verify` | Verify payment | ✅ |
| GET | `/api/payment/history` | Get payment history | ✅ |
| GET | `/api/payment/premium-status` | Check premium status | ✅ |

### Query Parameters (GET /api/tasks)
```
?status=todo|in-progress|completed
?priority=low|medium|high
?search=keyword
?sort=-createdAt|createdAt|dueDate|-priority
```

---

## 💳 Payment Flow

1. User clicks "Upgrade to Premium" on Dashboard
2. Redirected to Premium Page with plan options
3. User clicks "Pay with Khalti"
4. Khalti payment modal opens
5. User completes payment (test: 9800000005)
6. Callback verifies payment and updates user premium status
7. User receives premium badge and features are unlocked

---

## 📧 Email Reminders (Cron Jobs)

The system automatically sends email reminders for tasks:
- **Daily at 8:00 AM** — Tasks due today
- **Hourly** — Tasks due in next hour
- **Premium users only** — This feature requires premium subscription

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Payments | Khalti API |
| Emails | Nodemailer |
| Cron Jobs | node-cron |
| Frontend | React 18 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Dates | date-fns |
| Fonts | Google Fonts (Syne + DM Sans) |

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `KHALTI_SECRET_KEY`, etc.)
2. Set start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Build: `npm run build`
2. Set `REACT_APP_API_URL=https://your-backend-url.com/api`

---


---

## 📝 License
MIT

---

## 👨‍💻 Author

**Sabin Sapkota**
- GitHub: [@sabin770](https://github.com/sabin770)
- Email: sabintapkota@gmail.com

---

## 🙏 Acknowledgments

- Khalti for payment gateway
- MongoDB for database
- All open-source contributors
```
