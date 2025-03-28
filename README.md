# BasaFinder - Smart Rental & Housing Solution

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [User Roles & Access Control](#user-roles--access-control)
- [Security Measures](#security-measures)
- [Deployment](#deployment)
- [Contributors](#contributors)

---

## Project Overview
BasaFinder is a smart rental housing platform connecting landlords, tenants, and administrators. Landlords can post rental listings, tenants can search and request rentals, and an admin oversees user activities and rental listings.

---

## Features
### Roles
- **Admin**: Manages users and rental listings.
- **Landlord**: Posts and manages rental listings, approves/rejects rental requests.
- **Tenant**: Searches for rental properties and submits rental requests.

### Core Functionalities
- **Rental Listings**: Landlords can post detailed rental listings.
- **Search & Filter**: Tenants can filter properties by location, price, and bedrooms.
- **Rental Requests**: Tenants submit rental requests; landlords approve/reject them.
- **Payments**: Payments enabled upon approval of rental requests.
- **Role-Based Dashboards**: Custom dashboards for Admin, Landlords, and Tenants.
- **Email Notifications**: Automatic updates on rental requests.

---

## Technology Stack
### Frontend
- **Next.js**
- **TypeScript**
- **React.js**
- **ShadCN UI**
- **Redux Toolkit**

### Backend
- **Node.js** with **Express.js**
- **MongoDB**
- **JWT** Authentication
- **bcrypt** Password Hashing

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel

---

## Installation & Setup
### Prerequisites
- Node.js installed
- MongoDB setup
- Environment variables configured

### Backend Setup
```sh
cd backend
npm install
npm start
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

---


## Project Structure
```
📂 BasaFinder
 ├── 📂 backend
 │   ├── 📂 models
 │   ├── 📂 routes
 │   ├── 📂 controllers
 │   ├── 📂 middleware
 │   ├── server.js
 │   └── .env
 ├── 📂 frontend
 │   ├── 📂 components
 │   ├── 📂 pages
 │   ├── 📂 styles
 │   ├── 📂 redux
 │   ├── next.config.js
 │   └── package.json
```

---

## User Roles & Access Control
### Admin
- Manages users and rental listings
- Can approve/reject listings

### Landlord
- Posts and manages rental listings
- Approves/rejects rental requests

### Tenant
- Searches and requests rental listings
- Makes payments upon approval

---

## Security Measures
- **JWT Authentication**: Secure API access
- **Bcrypt Hashing**: Password protection
- **Role-Based Access Control**: Secure dashboards and API endpoints
- **Environment Variables**: Secure sensitive data

---

## Deployment
1. **Frontend**
   - Deployed to Vercel
   - Updated `.env` with API URL
2. **Backend**
   - Deployed to Vercel
   - Configured database connection

---

## Contributors
- **Rakesh Biswas** - Full Stack Developer

---

