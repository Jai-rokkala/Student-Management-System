# 🎓 Student Management System

A full-stack Student Management System built with React, Node.js, Express, and PostgreSQL.

## 🧰 Tech Stack
- **Frontend:** React, Axios, React Router DOM, React Hot Toast
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL

## ✨ Features
- Add / Edit / Delete students
- Auto-generated Admission Numbers (ADM-YEAR-XXXX)
- Photo upload
- Search, Filter & Pagination
- Activity Logging
- Responsive UI

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /students | Fetch all students |
| GET | /students/:id | Fetch single student |
| POST | /students | Add new student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

## ⚙️ Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- Git

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=student_management
```

```bash
npm run dev
```

### Database Setup
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

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)