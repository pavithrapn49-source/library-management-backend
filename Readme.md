# Library Management Backend

This is a Node.js backend project for managing a library system. It provides RESTful APIs for managing books, users, and transactions such as borrowing and returning books.

## Features
- User authentication and authorization
- CRUD operations for books and users
- Borrow and return book functionality
- Search and filter books
- API endpoints for all major operations

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or above)
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd library-management-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file (see `.env.example` if available).
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete a book
- `POST /api/borrow` - Borrow a book
- `POST /api/return` - Return a book

## Folder Structure
```
├── controllers
├── models
├── routes
├── middleware
├── config
├── app.js / server.js
└── Readme.md
```

## License
This project is licensed under the MIT License.
