# 🚗 LuxeDrive — Car Rental System

Fullstack premium car rental platform with role-based access.

## Team Members
- [Your Name] — Full Stack

## Tech Stack
- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Auth: JWT + bcryptjs

## API Endpoints
[see full list above]

## Setup
1. `cd backend && npm install && npm run dev`
2. `node seed.js`
3. `cd frontend && npm install && npm run dev`

## Roles
- **Admin**: full access, manage cars/users/bookings
- **Manager**: approve/reject bookings, add cars
- **User**: browse, book, review cars

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Manager | manager@demo.com | password123 |
| User | user@demo.com | password123 |





# API LIST FOR REST MAN
### AUTH
POST   http://localhost:5000/api/auth/register
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/auth/me          [Bearer token]

### CARS
GET    http://localhost:5000/api/cars             [public, ?search=BMW&category=suv&maxPrice=300]
GET    http://localhost:5000/api/cars/:id         [public]
POST   http://localhost:5000/api/cars             [admin, manager]
PUT    http://localhost:5000/api/cars/:id         [admin, manager]
DELETE http://localhost:5000/api/cars/:id         [admin]
POST   http://localhost:5000/api/cars/:id/reviews [user]

### BOOKINGS
GET    http://localhost:5000/api/bookings         [user→own, admin/manager→all]
GET    http://localhost:5000/api/bookings/:id     [auth]
POST   http://localhost:5000/api/bookings         [user] body: {carId, startDate, endDate, notes}
PUT    http://localhost:5000/api/bookings/:id/status   [admin, manager] body: {status}
PUT    http://localhost:5000/api/bookings/:id/cancel   [auth]

### USERS
GET    http://localhost:5000/api/users            [admin]
PUT    http://localhost:5000/api/users/:id        [admin]
DELETE http://localhost:5000/api/users/:id        [admin]