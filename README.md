# Pipeline CRM — Mini Opportunity Tracker

A full-stack MERN web application for managing a shared CRM-style sales opportunity pipeline. Built with secure JWT authentication, ownership-based authorization, and a clean React frontend.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Frontend  | React 18 + Vite, React Router v6, Axios |
| Backend   | Node.js, Express.js                    |
| Database  | MongoDB + Mongoose                     |
| Auth      | JWT (jsonwebtoken) + bcrypt            |
| Validation| express-validator                      |
| Deploy    | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## Features

- ✅ Secure registration & login with bcrypt password hashing
- ✅ JWT authentication (2h expiry, stored in localStorage)
- ✅ Shared opportunity pipeline visible to all users
- ✅ Ownership-based edit/delete (enforced on backend)
- ✅ Filters: stage, priority, search, sort
- ✅ Summary dashboard: pipeline value, won value, high-priority count
- ✅ Toast notifications and loading/error states
- ✅ Responsive design

---

## Project Structure

```
crm/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── opportunityController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Opportunity.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── opportunityRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── OpportunityCard.jsx
    │   │   └── OpportunityForm.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/crm_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=2h
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit VITE_API_BASE_URL if needed
npm run dev
# App runs on http://localhost:3000
```

---

## API Reference

### Auth

| Method | Endpoint           | Access  | Description              |
|--------|--------------------|---------|--------------------------|
| POST   | /api/auth/register | Public  | Register new user        |
| POST   | /api/auth/login    | Public  | Login, returns JWT token |
| GET    | /api/auth/me       | Private | Get current user profile |

### Opportunities

| Method | Endpoint                 | Access        | Description                  |
|--------|--------------------------|---------------|------------------------------|
| GET    | /api/opportunities       | All logged-in | View all opportunities        |
| POST   | /api/opportunities       | All logged-in | Create opportunity            |
| GET    | /api/opportunities/:id   | All logged-in | Get single opportunity        |
| PUT    | /api/opportunities/:id   | Owner only    | Update opportunity            |
| DELETE | /api/opportunities/:id   | Owner only    | Delete opportunity            |

**Query params for GET /api/opportunities:**
- `search` — search in customerName, requirement, contactName
- `stage` — filter by stage
- `priority` — filter by priority
- `sortBy` — field to sort (default: `createdAt`)
- `order` — `asc` or `desc` (default: `desc`)

---

## Deployment

### Backend → Render

1. Push backend to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node src/server.js`
5. Add all environment variables from `.env`

### Frontend → Vercel

1. Push frontend to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set `VITE_API_BASE_URL` to your Render backend URL
4. Deploy

### Database → MongoDB Atlas

1. Create free cluster on [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (all IPs) for cloud deployment
4. Copy connection string into `MONGO_URI`

---

## Security Notes

- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT secret is stored in environment variables only
- User identity is always extracted from the JWT on the backend — never trusted from request body
- Ownership is validated server-side before any update or delete
- No secrets are committed to source control

---

## Known Limitations / Possible Improvements

- No pagination (all opportunities loaded at once)
- No kanban board view
- No activity/follow-up history per opportunity
- No email notifications for follow-up dates
- No unit/integration tests (yet)
- No Docker setup
