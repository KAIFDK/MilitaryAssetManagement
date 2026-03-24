# 🎖️ Military Asset Management System (M-A-M-S)

A comprehensive web-based asset management platform for military bases, designed to streamline inventory tracking, equipment transfers, and personnel assignments across multiple operational locations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [Login Credentials](#login-credentials)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Key Features Guide](#key-features-guide)

## ✨ Features

### Asset Management
- ✅ **Equipment Catalog** - Create and manage equipment types (Vehicles, Weapons, Ammunition)
- ✅ **Base Management** - Establish and manage multiple military bases
- ✅ **Inventory Tracking** - Real-time asset inventory by base and equipment type
- ✅ **Transaction History** - Complete audit trail of all asset movements

### Operations
- ✅ **Purchases** - Record new equipment acquisitions
- ✅ **Transfers** - Move equipment between bases with atomic transactions
- ✅ **Assignments** - Issue equipment to personnel with custody tracking
- ✅ **Expenditures** - Track equipment consumption/destruction
- ✅ **Dashboard** - Real-time metrics and balance reporting

### Security
- ✅ Role-Based Access Control (RBAC) - ADMIN, COMMANDER, LOGISTICS
- ✅ JWT Authentication - Secure token-based sessions
- ✅ Permission Enforcement - Role-specific feature access
- ✅ Base-Level Isolation - Commanders see only their assigned base

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack React Query
- **Forms:** Zod validation
- **UI Components:** Lucide Icons, Framer Motion
- **State Management:** Zustand

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (with Prisma ORM)
- **Authentication:** JWT + bcryptjs
- **Validation:** Zod schemas
- **Dev Tools:** TypeScript, Nodemon

## 📁 Project Structure

```
MilitaryAssetManagement/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Purchases.tsx
│   │   │   ├── Transfers.tsx
│   │   │   ├── Assignments.tsx
│   │   │   ├── Equipment.tsx
│   │   │   ├── Bases.tsx
│   │   │   └── Login.tsx
│   │   ├── components/       # Reusable components
│   │   │   └── layout/
│   │   ├── store/            # Zustand state (authStore)
│   │   ├── lib/              # Utilities (api, utils)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.ts       # Login, register, bases, equipment
│   │   │   ├── transactions.ts # Purchases, transfers, assignments
│   │   │   └── dashboard.ts  # Metrics & reporting
│   │   ├── middleware/       # Authentication middleware
│   │   ├── utils/            # Prisma client
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── dev.db            # SQLite database
│   ├── seed.js               # Database seed script
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml        # Database configuration
└── README.md                 # This file
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 16+ and npm
- Git

### Step 1: Clone or Navigate to Project
```bash
cd MilitaryAssetManagement
```

### Step 2: Install Dependencies

**Frontend:**
```bash
cd client
npm install
cd ..
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### Step 3: Setup Environment Variables

**Server (.env):**
Create `.env` file in the `server` directory:
```env
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
DATABASE_URL="file:./dev.db"
```

### Step 4: Initialize Database

```bash
cd server
npx prisma migrate dev
cd ..
```

## 🌱 Database Seeding

Seed the database with test users, bases, and equipment:

```bash
cd server
npm run seed
cd ..
```

This creates:
- **3 Bases:** Fort Liberty, Naval Base San Diego, Joint Base Pearl Harbor-Hickam
- **6 Equipment Types:** M16 Rifle, Humvee, AH-64 Apache, 5.56mm Ammo, M240 Machine Gun, T-90 Tank
- **3 Test Users:** Admin, Commander, Logistics

## ▶️ Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Option 2: Run Individual Servers
- Frontend: `cd client && npm run dev`
- Backend: `cd server && npm run dev`

## 🔐 Login Credentials

Use these test accounts to explore different features:

### 👑 Admin Account
- **Email:** `admin@military.mil`
- **Password:** `admin123`
- **Access:** Full system access
  - Manage all bases
  - Manage equipment catalog
  - View all transactions
  - Access all pages

### 🎖️ Commander Account
- **Email:** `commander@military.mil`
- **Password:** `commander123`
- **Access:** Fort Liberty base only
  - Manage Fort Liberty inventory
  - Perform transactions for their base
  - Cannot manage equipment or bases
  - Cannot see other bases' data

### 📦 Logistics Account
- **Email:** `logistics@military.mil`
- **Password:** `logistics123`
- **Access:** Limited operations
  - View transactions
  - Perform purchases & transfers
  - View Dashboard
  - Assigned to Fort Liberty




## 🎯 Key Features Guide

### Dashboard
- **Real-time Metrics:** Opening balance, purchases, transfers, assignments, expenditure, closing balance
- **Equipment Filter:** View metrics for specific equipment types
- **Historical Charts:** Visualize inventory trends

### Purchases
- Record new equipment acquisitions
- Track quantity and cost center
- Attach notes for audit trail
- View procurement history

### Transfers
- Move equipment between bases
- Atomic transactions (ensure data consistency)
- Track source and destination
- View transfer history

### Assignments
- Issue equipment to service personnel
- Track physical custody
- Record assignment date and personnel name
- View all active assignments

### Equipment Catalog
- Create new equipment types
- Define categories (Vehicle, Weapon, Ammunition)
- Add descriptions for clarity
- Instantly available for all transactions

### Base Management
- Establish new military bases
- Track location information
- Manage equipment inventory by base
- Assign personnel to bases



## 🔐 Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 12 hours
- Role-based access control prevents unauthorized operations
- SQLite database (use PostgreSQL for production)
- HTTPS recommended for production deployment

## 🚀 Future Enhancements

- [ ] PostgreSQL database support
- [ ] Multi-factor authentication (MFA)
- [ ] Email notifications for transactions
- [ ] Advanced reporting & analytics
- [ ] Barcode/QR code scanning
- [ ] Mobile app (React Native)
- [ ] Real-time WebSocket updates
- [ ] Document attachment support
- [ ] Export to PDF/Excel
- [ ] Maintenance scheduling



---

**Last Updated:** March 25, 2026
**Version:** 1.0.0
