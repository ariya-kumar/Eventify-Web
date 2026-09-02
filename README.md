# 🎪 Eventify - Event & Service Management Platform

Eventify is a full-stack, scalable Event & Service Management application built on a clean **Model-View-Controller (MVC)** architecture using **Node.js, Express, MongoDB, React, Tailwind CSS, and Socket.io**.

It enables users to browse, search, and book Tamil Nadu cultural events and specialized event services (Weddings, Birthday Parties, Traditional Catering, Mandapam Decor, Nadaswaram Troupes, Photography, and Venues) with real-time updates and role-based JWT authentication.

---

## 🌟 Key Features

- **Clean MVC Architecture**: Fully decoupled backend with distinct controllers, services, Mongoose models, authentication middleware, and modular API routes.
- **Dual User Portals**:
  - **User Portal**: Event ticket booking, service reservations, rating search filters, and personal booking management with cancellation options.
  - **Organizer Portal**: Create and manage events & services, view customer bookings, and update booking status (`pending`, `confirmed`, `rejected`, `completed`).
- **Rating & Category Filters**: Search services by minimum rating (`4.0+`, `4.5+`, `4.8+`, `5.0`), service type (`Wedding`, `Birthday Parties`, `Catering`, `Photography`, `Venue`, `Decor & Lighting`, `Live Music & DJ`, `Event Planning`), location, and keywords.
- **Real-Time Communication**: Integrated **Socket.io** for live booking notifications and status updates.
- **Tamil Nadu Cultural Dataset**: Rich pre-seeded data including *Margazhi Music Festival*, *Chithirai Thiruvizha*, *Chettinad Banana Leaf Catering*, *Kongu Mandapam Floral Decor*, and *Nadaswaram Ensemble*.
- **Capacity & Ticket Management**: Real-time capacity deduction upon booking and automatic capacity restoration upon booking cancellation.

---

## 🏗️ Architecture & Project Structure

```
eventify/
├── backend/
│   ├── config/             # Database connection setup (db.js)
│   ├── controllers/        # Request handlers (authController.js, userController.js, organizerController.js)
│   ├── middleware/         # Auth JWT & Error handling middleware
│   ├── models/             # Mongoose schemas (User, Organizer, Event, Service, Booking)
│   ├── routes/             # Express API router definitions
│   ├── services/           # Business logic & ticket capacity handlers (bookingService.js)
│   ├── utils/              # JWT token generator helpers
│   ├── app.js              # Express app configuration & middleware pipeline
│   ├── seed.js             # Database seeding script with Tamil Nadu data
│   └── server.js           # Server entry point & Socket.io initialization
├── components/             # Reusable React UI components
├── context/                # AuthContext for session management
├── pages/                  # React pages (Home, Search, Events, Services, Dashboards, Auth)
├── test-api.mjs            # Automated integration test runner
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017/eventify` (or MongoDB Atlas URI)

### 1. Installation

Install dependencies for both frontend and backend root packages:

```bash
# Install root & frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

---

### 2. Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/eventify
JWT_SECRET=eventify_super_secret_jwt_key_2026
JWT_EXPIRES_IN=30d
```

---

### 3. Seed Database

Populate the database with realistic Tamil Nadu events, vendors, and test accounts:

```bash
cd backend
node seed.js
cd ..
```

---

### 4. Run Application

Run both backend server (port 5000) and frontend Vite dev server (port 3000) concurrently:

```bash
npm run dev:full
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

