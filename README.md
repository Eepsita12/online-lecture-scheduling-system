# Online Lecture Scheduling System

A full-stack **MERN** web application designed to manage online lecture scheduling with role-based access control, real-time conflict prevention, and secure JWT authentication. Built with industry best practices for scalability and maintainability.

---

## Live Deployment

| Component | URL | Platform |
|-----------|-----|----------|
| **Frontend** | https://online-lecture-scheduling-system.vercel.app/ | Vercel |
| **Backend API** | https://online-lecture-scheduling-system.onrender.com | Render |
| **Database** | MongoDB Atlas | Cloud |

**Deployment Pipeline:**
- Frontend: Auto-deploys on push to `main` branch with environment variables pre-configured
- Backend: Auto-deploys with MongoDB Atlas integration and CORS policy enabled
- Database: Cloud-hosted with automatic backups and data persistence

---

## Login Credentials

### Admin Account
- **Email:** admin@test.com
- **Password:** admin123

### Instructor Account
- **Email:** instructor@test.com
- **Password:** instructor123

---

## Features

### Admin Dashboard
- **Secure JWT-based authentication** with bcrypt password hashing
- **Instructor Management:** Create, view, and manage instructor profiles
- **Course Management:** Create and organize courses with descriptive details
- **Lecture Scheduling:** Assign lectures to instructors with conflict prevention
- **Smart Validation:** Backend enforces rule — *An instructor cannot be assigned more than one lecture on the same date*
- **Dashboard Statistics:**
  - Total courses in system
  - Total instructors on platform
  - Total lectures scheduled

### Instructor Portal
- **Secure login** with role-based access
- **Personalized Dashboard:** View only lectures assigned to them
- **Read-only Access:** Prevents unauthorized modifications
- **Real-time Data:** Fetches latest assignments on every login

---

## Tech Stack

### Frontend
- **React 18** with Vite (fast build tool)
- **React Router v6** (nested routes + protected route guards)
- **Axios** (HTTP client with JWT interceptor)
- **CSS3** (responsive design)

### Backend
- **Node.js** (v14+)
- **Express.js** (REST API framework)
- **MongoDB Atlas** (cloud database)
- **Mongoose** (schema validation)
- **JWT** (stateless authentication)
- **bcryptjs** (password encryption)
- **CORS** (cross-origin requests)

---

## Authentication & Authorization

**JWT Implementation:**
- Tokens issued upon successful login with 24-hour expiration
- Tokens attached to all API requests via Axios request interceptor
- Automatic token refresh on 401 response

**Role-Based Access Control:**
- `admin` — Full system access (create courses, instructors, lectures)
- `instructor` — Limited access (view assigned lectures only)
- Protected routes enforced with `ProtectedRoute` component
- Backend validates role on every API request

---

## Project Structure

```
online-lecture-scheduling-system/
│
├── backend/
│   ├── controllers/           # Business logic handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── instructorController.js
│   │   └── lectureController.js
│   │
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lecture.js
│   │   └── Instructor.js
│   │
│   ├── routes/                # API endpoints
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── instructorRoutes.js
│   │   └── lectureRoutes.js
│   │
│   ├── middleware/            # Authentication middleware
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── CourseManagement.jsx
│   │   │
│   │   ├── services/          # API client configuration
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env                   # Frontend environment variables
│
├── database-backup/           # MongoDB dump for restoration
│   ├── users.json
│   ├── courses.json
│   ├── lectures.json
│   ├── instructors.json
│   └── RESTORE_INSTRUCTIONS.md
│
├── README.md
└── .gitignore
```

---

## Application Flow

```
1. User navigates to login page
   ↓
2. User enters credentials (email + password)
   ↓
3. Backend validates credentials against MongoDB
   ↓
4. If valid: Generate JWT token → Store in localStorage
   ↓
5. Frontend routes user to dashboard based on role
   ↓
6. All subsequent API requests include JWT in Authorization header
   ↓
7. Backend verifies token on every protected route
   ↓
8. If token expired: Auto-redirect to login
```

### Admin Workflow
```
Admin Login → Create Instructors → Create Courses → Schedule Lectures
             ↓                      ↓                 ↓
          (Stored in DB)         (Stored in DB)   (Validated for conflicts)
```

### Instructor Workflow
```
Instructor Login → View Dashboard → See Assigned Lectures
                   ↓               (Real-time data)
              (Role-verified)
```

---

## Core Business Logic

### Lecture Conflict Prevention
The system prevents scheduling conflicts at the **backend level** (not just frontend) for data integrity:

**Validation Logic:**
```javascript
// Before creating a lecture, backend checks:
const existingLecture = await Lecture.findOne({
  instructor: instructorId,
  date: selectedDate
});

if (existingLecture) {
  return res.status(400).json({ 
    message: "Instructor already has a lecture on this date" 
  });
}
```

**Why backend validation?**
- Frontend validation can be bypassed
- Ensures data consistency even with direct API calls
- Prevents race conditions in concurrent requests

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login              Login with email & password
```

### Courses (Admin Only)
```
GET    /api/courses                 Fetch all courses
POST   /api/courses                 Create new course
GET    /api/courses/:id             Get course details
PUT    /api/courses/:id             Update course
DELETE /api/courses/:id             Delete course
```

### Instructors (Admin Only)
```
GET    /api/instructors             Fetch all instructors
POST   /api/instructors             Create new instructor
GET    /api/instructors/:id         Get instructor profile
PUT    /api/instructors/:id         Update instructor
DELETE /api/instructors/:id         Delete instructor
```

### Lectures (Role-Based)
```
POST   /api/lectures                Schedule new lecture (admin only)
GET    /api/lectures                Get all lectures (admin only)
GET    /api/lectures/my             Get instructor's lectures (instructor only)
PUT    /api/lectures/:id            Update lecture (admin only)
DELETE /api/lectures/:id            Delete lecture (admin only)
```

**Authentication:** All endpoints require valid JWT token in `Authorization: Bearer <token>` header

---

## Database Backup & Restoration

A complete MongoDB dump is included in the `database-backup/` directory for easy local setup.

**Included Collections:**
- `users` — Admin, instructor, and student accounts
- `courses` — Course metadata and details
- `lectures` — Scheduled lectures with date/time information
- `instructors` — Instructor profiles and assignments

**Restoration Instructions:**
See `database-backup/RESTORE_INSTRUCTIONS.md` for step-by-step guide using:
- MongoDB Compass (GUI)
- mongorestore (CLI)
- mongoimport (JSON import)

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with:
cat > .env << EOF
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online-lecture-scheduling-system
JWT_SECRET=your_secure_secret_key_here
PORT=4000
EOF

# 4. Start development server
npm run dev

# Server runs on http://localhost:4000
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file with:
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:4000/api
EOF

# 4. Start development server
npm run dev

# App runs on http://localhost:5173
```

### Running Together
Open two terminals side-by-side:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

---

## 🐛 Development Notes

**Key Debugging Points During Development:**

| Issue | Solution |
|-------|----------|
| API requests returning 404 | Verify `/api` prefix in axios baseURL |
| JWT token not attached to requests | Check axios interceptor adds `Authorization` header |
| Role mismatch on frontend | Normalize role to lowercase when storing JWT payload |
| Protected routes not working | Ensure `ProtectedRoute` checks `localStorage.getItem('token')` |
| CORS errors | Verify backend CORS config includes frontend origin URL |
| Instructor sees all lectures | Verify `GET /api/lectures/my` filters by authenticated user ID |

**Best Practices Applied:**
- ✅ Backend-first business rule enforcement (not relying on frontend validation)
- ✅ Stateless JWT authentication (no server-side sessions)
- ✅ Proper HTTP status codes (401 for auth, 403 for authorization, 400 for validation)
- ✅ Consistent error response format
- ✅ Protected API routes with middleware verification

---

## Known Issues & Limitations

- **Cold Start Delay:** Free-tier Render instances spin down after 15 minutes of inactivity, causing first request to take ~50 seconds
- **Storage Limits:** MongoDB Atlas free tier capped at 512MB (sufficient for this project)
- **Email Notifications:** Not implemented (can be added with Nodemailer)
- **Session Persistence:** JWT tokens expire after 24 hours; users must login again

**Workarounds:**
- Upgrade Render to paid tier for always-on instance
- Upgrade MongoDB Atlas to resolve storage limits
- Implement email service for notifications if needed

---

## Author

**Eepsita Modi**  
B.Tech Information Technology Student  
Full Stack / MERN Developer  
📧 eepsitamodi34@gmail.com  
🔗 GitHub: https://github.com/Eepsita12

---

## What This Project Demonstrates

✅ **Professional Authentication** — JWT-based with bcrypt password hashing  
✅ **Backend-First Validation** — Business rules enforced server-side, not frontend  
✅ **Clean Architecture** — Separation of concerns (controllers, models, routes)  
✅ **Role-Based Access Control** — Dynamic permissions based on user role  
✅ **Scalable Deployment** — Cloud-hosted with CI/CD pipeline  
✅ **Real-World Practices** — Error handling, status codes, middleware  
✅ **Database Design** — Proper schemas with relationships and indexes  

---

**Last Updated:** February 6, 2026  
**Status:** ✅ Production Ready
