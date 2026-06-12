# 🧠 QuizMaker — Online Quiz Platform

Built by **HARICHANDANA THOOPUKARI**

A full-stack quiz platform with authentication, quiz creation, taking, scoring, and an admin panel.

---

## 🗂 Project Structure

```
quizmaker/
├── backend/          # Node.js + Express + MongoDB
└── frontend/         # React + Vite + Tailwind CSS
```

---

## ⚡ Quick Start (Local Development)

### 1. MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → create a free cluster
2. Create a database user (username + password)
3. Whitelist IP: `0.0.0.0/0` (allow all for dev)
4. Get your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/quizmaker?retryWrites=true&w=majority
   ```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/quizmaker?retryWrites=true&w=majority
JWT_SECRET=supersecretkey_changeme_in_production
NODE_ENV=development
```

Seed the database with sample data:
```bash
npm run seed
```

This creates:
| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@example.com      | Password123 |
| Creator | creator@example.com    | Password123 |
| User    | user@example.com       | Password123 |

Start the backend:
```bash
npm run dev
```
Backend runs at → **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
Frontend runs at → **http://localhost:5173**

---

## 🔐 User Roles

| Role    | Permissions                                              |
|---------|----------------------------------------------------------|
| user    | Browse quizzes, take quizzes, view results               |
| creator | All above + create/edit/delete own quizzes               |
| admin   | All above + admin panel, delete any user or quiz         |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description     |
|--------|----------------------|-----------------|
| POST   | /api/auth/register   | Register user   |
| POST   | /api/auth/login      | Login user      |

### Quizzes
| Method | Endpoint             | Auth | Description          |
|--------|----------------------|------|----------------------|
| GET    | /api/quizzes         | No   | List all quizzes     |
| GET    | /api/quizzes/:id     | No   | Get single quiz      |
| POST   | /api/quizzes         | Yes  | Create quiz          |
| PUT    | /api/quizzes/:id     | Yes  | Update quiz          |
| DELETE | /api/quizzes/:id     | Yes  | Delete quiz          |

### Results
| Method | Endpoint               | Auth | Description        |
|--------|------------------------|------|--------------------|
| POST   | /api/results           | Yes  | Submit result      |
| GET    | /api/results/user/:id  | Yes  | User's results     |
| GET    | /api/results/:id       | Yes  | Single result      |

### Admin
| Method | Endpoint               | Auth  | Description        |
|--------|------------------------|-------|--------------------|
| GET    | /api/admin/stats       | Admin | Platform stats     |
| GET    | /api/admin/users       | Admin | All users          |
| GET    | /api/admin/quizzes     | Admin | All quizzes        |
| DELETE | /api/admin/users/:id   | Admin | Delete user        |
| DELETE | /api/admin/quizzes/:id | Admin | Delete quiz        |

---

## 🚀 Deployment

### Backend → Render.com

1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `NODE_ENV` = production
   - `FRONTEND_URL` = your Vercel frontend URL
6. Deploy → copy your Render URL (e.g. `https://quizmaker-api.onrender.com`)

---

### Frontend → Vercel

1. Push frontend folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Settings:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://quizmaker-api.onrender.com/api`
6. Deploy → your live URL is ready!

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS      |
| Routing   | React Router DOM v6               |
| HTTP      | Axios                             |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas + Mongoose          |
| Auth      | JWT + bcryptjs                    |
| Dev Tools | Nodemon, Vite HMR                 |

---

## 📁 Full File Structure

```
quizmaker/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── resultController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminOnly.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── resultRoutes.js
│   │   └── adminRoutes.js
│   ├── data/sampleQuizzes.js
│   ├── seeds/seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── QuizCard.jsx
    │   │   ├── QuestionForm.jsx
    │   │   ├── DashboardSidebar.jsx
    │   │   ├── Loader.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ProtectedAdminRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── QuizList.jsx
    │   │   ├── TakeQuiz.jsx
    │   │   ├── ResultPage.jsx
    │   │   ├── CreateQuiz.jsx
    │   │   ├── AdminPanel.jsx
    │   │   └── NotFound.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .env.example
```
