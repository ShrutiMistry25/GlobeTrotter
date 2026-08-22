# GlobeTrotter - Personalized Travel Planning

**Industry:** Travel & Tourism
**Theme:** Smart Trip Planning & Collaboration

## Project Overview

GlobeTrotter is a travel planning platform that helps users **create, organize, manage, and share multi-city trips** from one place.

## The Problem

Planning a trip can be difficult because users have to manage:

* Multiple destinations
* Travel dates
* Activities
* Itineraries
* Expenses
* Group planning

## Our Solution

GlobeTrotter provides one platform where users can:

1. Create a trip
2. Add multiple destinations
3. Plan day-wise activities
4. Manage the trip budget
5. View the itinerary using calendar/timeline
6. Collaborate with friends
7. Share trips using public links

## Key Features

* **Authentication** - Login, Signup & Forgot Password
* **Dashboard** - View upcoming and recent trips
* **Trip Planner** - Create trips and add destinations
* **Itinerary** - Organize activities day-wise
* **Budget Management** - Track travel expenses
* **Calendar & Timeline** - Visualize the trip
* **Collaboration** - Plan trips with friends
* **Trip Sharing** - Share itineraries through public links

## Tech Stack

**Frontend**

* React.js 18 (Vite)
* JavaScript
* Tailwind CSS
* Recharts

**Backend**

* Node.js
* Express.js
* REST API + JWT auth

**Database**

* MySQL 8

**Tools**

* Git & GitHub
* VS Code
* Postman

## Project Structure

```text
GlobeTrotter/
├── frontend/            # React SPA (pages, components, api, context)
├── backend/             # Express API (routes, controllers, models, middleware)
├── database/            # schema.sql, seed.sql, ER-Diagram.png
├── docs/                # api-documentation.md, architecture.png
├── .env.example         # environment template
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

* Node.js ≥ 18
* MySQL 8 running locally

### Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Seed data includes a demo account: **elena@globetrotter.app / Demo@1234**
(12 cities · 38 activities · sample trips with itineraries & expenses).

### Environment Variables

Copy `.env.example` to `backend/.env` and fill in your MySQL password and a JWT secret.

### Backend

```bash
cd backend
npm install
npm start          # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Then open **http://localhost:5173**, log in with the demo account and explore.

API reference: [`docs/api-documentation.md`](docs/api-documentation.md)

## Goal

Our goal is to make travel planning **simple, personalized, collaborative, and budget-friendly** by bringing the complete trip planning process into one platform.

## Team

**GlobeTrotter — Hackathon Project**
