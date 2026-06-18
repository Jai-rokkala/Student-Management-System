# 🎓 Student Management System

A full-stack Student Management System built with React, Node.js, Express, and PostgreSQL.

## 🔗 Live Demo
- **Frontend (Vercel):** https://student-management-system-umber-seven.vercel.app
- **Backend API (Railway):** https://student-management-system-production-5527.up.railway.app

## 🧰 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Axios, React Router DOM, React Hot Toast |
| Backend | Node.js, Express.js, Multer |
| Database | PostgreSQL |
| Deployment | Vercel (Frontend), Railway (Backend + DB) |

## ✨ Features
- ➕ Add / ✏️ Edit / 🗑️ Delete students
- 🔢 Auto-generated Admission Numbers (ADM-YEAR-XXXX)
- 📷 Photo upload
- 🔍 Search by name, email, admission number
- 🎓 Filter by course
- 📄 Server-side Pagination
- 📊 Student stats (Total, Male, Female)
- 📝 Activity Logging
- ✅ Frontend & Backend form validation
- 📱 Responsive UI

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /students | Fetch all students (supports search, filter, pagination) |
| GET | /students/:id | Fetch single student |
| POST | /students | Add new student (with photo upload) |
| PUT | /students/:id | Update student details |
| DELETE | /students/:id | Delete student |

## 🗄️ Database Schema

### students
```sql
CREATE TABLE students (
  id               SERIAL PRIMARY KEY,
  admission_number VARCHAR(30) UNIQUE NOT NULL,
  name             VARCHAR(100) NOT NULL,
  course           VARCHAR(100) NOT NULL,
  year             INTEGER NOT NULL CHECK (year BETWEEN 1 AND 6),
  date_of_birth    DATE NOT NULL,
  email            VARCHAR(150) UNIQUE NOT NULL,
  mobile_number    VARCHAR(15) NOT NULL,
  gender           VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
  address          TEXT NOT NULL,
  photo_url        VARCHAR(255),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### activity_logs
```sql
CREATE TABLE activity_logs (
  id          SERIAL PRIMARY KEY,
  action      VARCHAR(50) NOT NULL,
  student_id  INTEGER,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Jai-rokkala/Student-Management-System.git
cd Student-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=student_management
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Database Setup
Run these SQL commands in PostgreSQL:
```sql
CREATE DATABASE student_management;

CREATE TABLE students (
  id               SERIAL PRIMARY KEY,
  admission_number VARCHAR(30) UNIQUE NOT NULL,
  name             VARCHAR(100) NOT NULL,
  course           VARCHAR(100) NOT NULL,
  year             INTEGER NOT NULL CHECK (year BETWEEN 1 AND 6),
  date_of_birth    DATE NOT NULL,
  email            VARCHAR(150) UNIQUE NOT NULL,
  mobile_number    VARCHAR(15) NOT NULL,
  gender           VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
  address          TEXT NOT NULL,
  photo_url        VARCHAR(255),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
  id          SERIAL PRIMARY KEY,
  action      VARCHAR(50) NOT NULL,
  student_id  INTEGER,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
student-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── studentController.js
│   │   ├── middleware/
│   │   │   └── uploadMiddleware.js
│   │   ├── routes/
│   │   │   └── studentRoutes.js
│   │   └── app.js
│   ├── uploads/
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        │   └── studentApi.js
        ├── components/
        │   ├── Navbar.jsx
        │   └── StudentForm.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── AddStudentPage.jsx
        │   └── EditStudentPage.jsx
        └── App.js
```

## ⭐ Bonus Features Implemented
- ✅ Search & Filter functionality
- ✅ Server-side Pagination
- ✅ Activity Logging
- ✅ Database Indexes for performance
- ✅ Environment variables
