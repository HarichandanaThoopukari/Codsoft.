# 💼 JobBoard - Full Stack Job Portal

A professional job board application built with React.js, Node.js + Express.js, and MongoDB.

## 🚀 Features

- **Home Page** — Hero section, featured jobs, category browsing, search
- **Authentication** — JWT-based login/register for Candidates & Employers
- **Job Listings** — Search, filter by type/location/experience/salary
- **Job Detail** — Full details + one-click apply with resume upload
- **Employer Dashboard** — Post/edit/delete jobs, manage applications, update status
- **Candidate Dashboard** — Track applications, manage profile & resume
- **Email Notifications** — Nodemailer for application events
- **Responsive Design** — Mobile-first, works on all devices

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Email | Nodemailer |
| Deployment | Render (backend) + Vercel (frontend) |

---

## 📁 Project Structure

```
jobboard/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Email, token helpers
│   ├── uploads/        # Resume files (gitignored)
│   ├── server.js       # Entry point
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # Navbar, Footer, JobCard
│   │   ├── context/    # AuthContext
│   │   ├── pages/      # All page components
│   │   └── utils/      # Axios instance
│   └── .env.example
└── render.yaml         # Deployment config
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/jobboard.git
cd jobboard

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 2 — Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3 — Run Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start
# Runs on http://localhost:3000
```

---

## 🌐 API Documentation

### Auth Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Job Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/jobs` | List all jobs (with filters) | ❌ |
| GET | `/api/jobs/featured` | Get 6 featured jobs | ❌ |
| GET | `/api/jobs/:id` | Get single job | ❌ |
| POST | `/api/jobs` | Create job | Employer |
| PUT | `/api/jobs/:id` | Update job | Employer |
| DELETE | `/api/jobs/:id` | Delete job | Employer |
| GET | `/api/jobs/employer` | Get employer's jobs | Employer |

### Application Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/applications/apply/:jobId` | Apply to job | Candidate |
| GET | `/api/applications/my` | My applications | Candidate |
| GET | `/api/applications/job/:jobId` | Job applications | Employer |
| PUT | `/api/applications/:id/status` | Update status | Employer |

### User Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/users/profile` | Get profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| GET | `/api/users/employers` | List employers | ❌ |

---

## 🚀 Deployment Guide

### Option A: Render (Backend) + Vercel (Frontend) — Recommended Free Tier

#### 1. MongoDB Atlas Setup (Free Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account → "Build a Database" → Free M0 tier
3. Choose AWS / region nearest to you
4. Create username & password (save them!)
5. Under "Network Access" → Add IP: `0.0.0.0/0` (allow all)
6. Under "Database" → Connect → "Connect your application"
7. Copy the connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/jobboard?retryWrites=true&w=majority
   ```

#### 2. Deploy Backend to Render (Free)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/jobboard.git
   git push -u origin main
   ```

2. Go to [render.com](https://render.com) → Sign up → "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** `jobboard-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
5. Add Environment Variables:
   ```
   MONGO_URI = mongodb+srv://...your Atlas URI...
   JWT_SECRET = any_long_random_string_here_32chars
   JWT_EXPIRE = 7d
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your@gmail.com
   EMAIL_PASS = your_app_password
   FRONTEND_URL = https://your-app.vercel.app
   NODE_ENV = production
   ```
6. Click "Create Web Service" — wait ~3 minutes
7. Copy your backend URL: `https://jobboard-backend.onrender.com`

#### 3. Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. "Add New Project" → Import your GitHub repo
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://jobboard-backend.onrender.com/api
   ```
5. Click "Deploy" — wait ~2 minutes
6. Copy your frontend URL: `https://jobboard.vercel.app`

#### 4. Update CORS

Go back to Render → Your backend service → Environment → Update:
```
FRONTEND_URL = https://jobboard.vercel.app
```
Then redeploy.

---

### Option B: Railway (Full-stack, easiest)

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Add a MongoDB plugin (free 500MB)
4. Set env vars (same as above, use Railway's `MONGO_URL` variable)
5. Add a second service for the frontend, or serve frontend from backend

---

### Option C: VPS (DigitalOcean / AWS EC2)

```bash
# On your server (Ubuntu 22.04)
sudo apt update && sudo apt install -y nodejs npm nginx

# Clone repo
git clone https://github.com/YOUR_USERNAME/jobboard.git
cd jobboard/backend
cp .env.example .env   # edit with your values
npm install

# Install PM2 (process manager)
sudo npm install -g pm2
pm2 start server.js --name jobboard-api
pm2 startup && pm2 save

# Build frontend
cd ../frontend
npm install && npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/jobboard
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React frontend
    root /var/www/jobboard/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Proxy API calls to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/jobboard /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Copy built frontend
sudo mkdir -p /var/www/jobboard
sudo cp -r frontend/build /var/www/jobboard/frontend/
```

Add SSL with Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📧 Gmail App Password Setup

For Nodemailer with Gmail:

1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Go to: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and your device → Generate
5. Copy the 16-character password — use it as `EMAIL_PASS`

---

## 🔧 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| CORS error in browser | Check `FRONTEND_URL` in backend env matches exact Vercel URL |
| MongoDB connection failed | Check Atlas IP whitelist = `0.0.0.0/0`, verify connection string |
| JWT errors | Make sure `JWT_SECRET` is set and at least 32 chars |
| File uploads not working | On cloud deploys, use AWS S3 or Cloudinary instead of local disk |
| Render backend sleeping | Free tier sleeps after 15min inactivity; first request takes ~30s |
| Email not sending | Verify Gmail app password, not your regular password |

---

## 🔒 Production Security Checklist

- [ ] Change JWT_SECRET to a strong random string (32+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Restrict MongoDB Atlas IPs to your server IP only
- [ ] Enable rate limiting (add `express-rate-limit` package)
- [ ] Use HTTPS only (handled by Render/Vercel automatically)
- [ ] Store files on S3/Cloudinary instead of local disk

---

## 📦 Adding File Storage (AWS S3) — Optional

For production resume uploads, replace multer disk storage with S3:

```bash
cd backend && npm install @aws-sdk/client-s3 multer-s3
```

Add to `.env`:
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=jobboard-resumes
```

---

## 🧪 Test Accounts

After running locally, register via the UI:
- **Employer:** register with role "Employer" → post jobs
- **Candidate:** register with role "Job Seeker" → browse and apply

---

## 📄 License

MIT — Free to use for personal and commercial projects.
