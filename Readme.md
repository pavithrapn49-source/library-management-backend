# 📚 Library Management System (Full Stack Capstone Project)

A complete **Library Management System** built using **React.js, Node.js, Express.js, MongoDB** with secure authentication, admin/member dashboards, borrowing workflow, return tracking, fines management, analytics charts, and reservation features.

---

# 🌐 Live Demo

## Frontend

https://react-library-management-gzi1.vercel.app

## Backend API

https://library-management-backend-0un8.onrender.com

---

# 🔑 Demo Credentials

## 👑 Admin Login

Email: admin@gmail.com  
Password: admin123

## 👤 Member Login

Email: member@gmail.com  
Password: member123

    If these users are not created, use Register page and assign role manually in MongoDB.

---

# 📌 Project Overview

This system helps manage library operations digitally.

Users can:

- Register/Login securely
- Browse books
- Borrow books
- Return books
- Reserve unavailable books
- Pay overdue fines
- Track history

Admins can:

- Manage books
- Manage users
- Monitor borrow activity
- View analytics dashboard
- Track overdue books
- Collect fine reports

---

# 🚀 Key Features

# 👤 Authentication

- JWT Login / Register
- Role-based access
- Protected routes
- Persistent login session

---

# 👑 Admin Dashboard

- Add new books
- Edit book details
- Delete books
- Delete users
- View total books/users
- Track active borrows
- Overdue monitoring
- Fine revenue tracking
- Dashboard charts

---

# 👤 Member Dashboard

- Search books
- Borrow available books
- Reserve unavailable books
- Return borrowed books
- View due dates
- Overdue alerts
- Borrow history
- Fine payment

---

# 📚 Borrow vs Reserve (Important)

## Borrow

When a book is currently available, member can borrow instantly.

Example:

Book Status = Available ✅  
Action = Borrow

---

## Reserve

When a book is already borrowed by another user, member can reserve it.

Example:

Book Status = Borrowed ❌  
Action = Reserve

Once returned, reserved user gets priority.

---

# 📊 Advanced Features

- Pie chart analytics
- Responsive UI
- Toast notifications
- Animated cards
- Book images
- Search + filters
- Fine calculation system

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Framer Motion
- Recharts
- React Toastify
- CSS3

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

---

# 📂 Folder Structure

```bash
library-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   ├── context/
│   │   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js


⚙️ Installation

   1️⃣ Clone Project

      git clone   https://github.com/pavithrapn49-source?tab=repositories

  2️⃣ Backend Setup
      cd backend
      npm install
      npm run dev

   3️⃣ Frontend Setup
      cd frontend
      npm install
      npm run dev

🔐 Environment Variables

Create .env in backend:

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

      📡 Main API Routes

      Auth
      POST /api/users/register
      POST /api/users/login
      Books
      GET /api/books
      POST /api/books
      PUT /api/books/:id
      DELETE /api/books/:id
      Transactions
      POST /api/transactions/borrow/:id
      POST /api/transactions/return/:id
      GET /api/transactions/my-borrows
      GET /api/transactions/history
      GET /api/transactions/dues
      POST /api/transactions/pay-fine/:id
      ```
👩‍💻 Developed By

Pavithra P N

📄 License

MIT License