# Online Lecture Scheduling System

A full-stack **MERN** web application designed to manage online lecture scheduling between **Admins** and **Instructors**, with strict conflict prevention and role-based access control.

This project was built as part of an internship assignment and follows real-world backend validation and frontend routing practices.

---

## Features

### Admin
- Secure login using JWT authentication
- Create and manage instructors
- Create and manage courses
- Assign lectures to instructors on specific dates
- Backend-enforced rule:
  > An instructor **cannot be assigned more than one lecture on the same date**
- View dashboard statistics:
  - Total courses
  - Total instructors
  - Total lectures scheduled

### Instructor
- Secure login using JWT authentication
- View only their assigned lectures
- Read-only access (no create/update permissions)

---

## Tech Stack

### Frontend
- React (Vite)
- React Router v6 (nested routes + protected routes)
- Axios (with interceptor for JWT)
- Plain CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt for password hashing

---

## Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - `admin`
  - `instructor`
- Protected routes implemented using a reusable `ProtectedRoute` component
- Tokens are attached to all API requests via Axios interceptor

---

## Project Structure

```

Online-Lecture-Scheduling-System/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── README.md
└── .gitignore

````

---

## Application Flow

1. **Admin logs in**
2. Admin creates instructors and courses
3. Admin assigns lectures to instructors with a selected date
4. Backend checks for scheduling conflicts
5. Instructor logs in
6. Instructor dashboard fetches lectures assigned **only to that instructor**

---

## Core Business Logic

### Lecture Conflict Prevention
Before creating a lecture, the backend checks:

```js
Lecture.findOne({
  instructor: instructorId,
  date: selectedDate
});
````

If a conflict exists, the lecture is not created.

This ensures data integrity even if frontend validation is bypassed.

---

## API Endpoints

### Auth

```
POST /api/auth/login
```

### Courses

```
GET  /api/courses
POST /api/courses      (admin only)
```

### Instructors

```
GET  /api/instructors
POST /api/instructors  (admin only)
```

### Lectures

```
POST /api/lectures           (admin only)
GET  /api/lectures           (admin only)
GET  /api/lectures/my        (instructor only)
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:4000
```

---

## Debugging Highlights

During development, the following issues were identified and resolved:

* API base URL mismatch (`/api` prefix missing)
* Axios requests missing JWT authorization header
* Role normalization issues between frontend and backend
* Incorrect nested routing configuration in React Router
* Duplicate component definitions
* Instructor lecture visibility linked strictly to authenticated instructor ID

All fixes were implemented following best practices without redesigning the system.

---

---

## Author

**Eepsita Modi**
B.Tech IT Student
Full Stack / MERN Developer

---

## Final Notes

This project demonstrates:

* Real-world authentication and authorization
* Backend-first business rule enforcement
* Clean frontend-backend integration
* Scalable project structure

The system is designed to be production-aligned and assignment-compliant.

```

