# OpenHand — Civic Sharing, Marketplace & Local Services Platform

> **A community-powered civic mesh connecting neighbours, students, verified shelters, and skilled workers across Indore, India.**  
> Zero Commission • Hyperlocal Radius (0.5 – 3 km) • Direct WhatsApp & Phone Connections

---

## 🌟 Overview

**OpenHand** is a lightweight, high-trust civic platform built for real-world Indian community needs. It bridges the gap between pre-owned item circulation, essential temporary rentals, shelter donations, and verified local handymen without middleman markups.

### 🏛️ The Three Core Pillars

1. **Buy, Sell & Rent (`/marketplace`)**:
   - **Buy & Sell**: Low-cost college textbooks (RGPV/GATE), scientific calculators, student bicycles, and hostel coolers.
   - **Community Rentals**: Rent uncommon, expensive, or temporary items from neighbours instead of buying full price:
     - ♿ **Medical & Mobility**: Senior folding walkers (from ₹30/day), lightweight wheelchairs (from ₹60/day), 5L oxygen concentrators.
     - 🛠️ **Heavy Tools**: 800W rotary hammer drills, masonry bits, ladder sets.
     - 📽️ **Campus & Event Gear**: Full HD 1080p projectors, 4-person waterproof camping tents.
   - **Transparent Rental Terms**: Per-day or per-month rates with refundable security deposits and direct owner WhatsApp chat.

2. **Shelter Donations & Food Rescue (`/donate`)**:
   - Clean winter clothes, blankets, shawls, and surplus banquet/hostel food matched directly with verified Indore shelters:
     - *Aastha Vriddhashram* (Old Palasia) — 18 elderly residents without immediate family.
     - *Snehalaya Bal Sadan* (Vijay Nagar) — 42 children requiring school bags and sweaters.
     - *Annapurna Roti Bank* (Chhappan Dukan) — Safe surplus food rescue.
   - Live wishlist tracking so donors give exactly what shelters need right now.

3. **Verified Local Services (`/services`)**:
   - Connect with trusted local handymen nearby with transparent inspection fees and zero commission markup:
     - **Nal Mistri (Plumbers)**: Tap leakage, Sintex tank valves, bathroom plumbing (from ₹150 visit fee).
     - **Bijli Mistri (Electricians)**: MCB breaker tripping, Havells wiring, fan regulators (from ₹200 visit fee).
     - **PC & Electronics Technicians**: SMPS, motherboard diagnostics, OS recovery (from ₹250 visit fee).
   - Citizens and students can also post urgent work orders for immediate assistance.

---

## 🚀 Key Technological Innovations

### 1. Civic Identity Engine (`/create-id`)
Users register a verified civic profile tailored to their community role:
- **NGO / Shelter**: Select operational focus and maintain an active wishlist (Blankets, Medical Supplies, School Bags).
- **Skilled Technician**: Select primary trade, inspection visit fee, experience, and specialization.
- **WhatsApp Alert Opt-In**: Receive instant automated notifications when matching items or work requests are posted in their ward.

### 2. Automated WhatsApp Alert Dispatcher (`/my-matches`)
- Powered by a weighted multi-factor matching engine (Category relevance, distance radius, and trade skill).
- Generates simulated alert dispatch notifications and direct `wa.me` links with pre-filled, context-rich messages.

### 3. Edge-to-Edge Responsive UI
- Fully responsive design covering 100% viewport width and height (`min-h-[calc(100vh-64px)]` and `max-w-[1560px]`).
- Clean, high-contrast typography, zero letterboxing on widescreen displays, and optimized for mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - Vite for fast HMR and optimized builds
  - Tailwind CSS with responsive design system
  - Lucide React icons
  - React Router v6
- **Backend**:
  - Node.js & Express with TypeScript
  - Prisma ORM with SQLite database
  - Socket.IO for real-time dispatch updates
  - JWT Authentication & bcryptjs password hashing
  - Zod for runtime schema validation
- **DevOps**:
  - Docker & Docker Compose support
  - Nginx configuration for production containerization

---

## 📁 Repository Structure

```
openhand/
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components & Navigation
│   │   │   └── ui/             # Navbar, Footer, UrgencyBadge, StatusChip...
│   │   ├── context/            # Authentication & State Management
│   │   ├── pages/              # Application Routes
│   │   │   ├── LandingPage.tsx     # Full-width cinematic home page
│   │   │   ├── MarketplacePage.tsx # Buy, Sell & Rent gear hub
│   │   │   ├── DonationPage.tsx    # Shelter wishlists & donation stream
│   │   │   ├── ServicesPage.tsx    # Verified technicians & job board
│   │   │   ├── CreateIdPage.tsx    # Civic ID registration (NGO/Worker)
│   │   │   ├── MyMatchesPage.tsx   # Personalized feed & WhatsApp engine
│   │   │   └── ...                 # Auth, Live Radar, Dashboards
│   │   └── services/           # API clients & Mock fallbacks
│   ├── index.html              # Entry HTML with custom SVG branding
│   └── package.json            # Client dependencies and build scripts
│
├── server/                     # Express REST API & Socket.IO Engine
│   ├── prisma/                 # Prisma schema & SQLite dev database
│   ├── src/                    # Controllers, middleware, routes, services
│   ├── .env.example            # Environment variables template
│   └── package.json            # Server dependencies
│
├── .gitignore                  # Comprehensive root git ignore
├── docker-compose.yml          # Containerized deployment spec
├── package.json                # Monorepo root scripts
└── README.md                   # Project documentation
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/openhand.git
   cd openhand
   ```

2. **Install all dependencies** (root, client, and server):
   ```bash
   npm run install:all
   ```

3. **Set up Environment Variables**:
   In `server/`:
   ```bash
   cp server/.env.example server/.env
   ```

4. **Initialize Database** (Prisma + SQLite):
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   * Frontend: **http://localhost:5173**
   * Backend API: **http://localhost:5000**

---

## 🔑 Demo Personas & Credentials

The platform includes a **One-Click Demo Sign-In Switcher** in the navigation bar for easy testing:

| Persona | Role | Location | Details |
|---|---|---|---|
| **Priya Sharma** | Student / Requester | SGSITS Campus, Indore | Campus member listing textbooks & hostel cooler |
| **Aarav Patel** | Hardware Helper | Central Library, Indore | Electronics technician & repair volunteer |
| **Aastha Vriddhashram** | Verified NGO | Old Palasia, Indore | 18 senior residents with active warmth wishlist |
| **Vikram Sharma** | Bijli Mistri | Bhawarkua, Indore | Certified electrician (₹200 inspection fee) |
| **Rameshwar Kumar** | Nal Mistri | Palasia, Indore | Experienced plumber (₹150 inspection fee) |

---

## 🚢 Production Build & Docker

### Local Production Build
```bash
npm run build
```
Generates production-optimized assets inside `client/dist`.

### Run via Docker Compose
```bash
docker-compose up --build -d
```
Runs frontend on port `80` and backend API on port `5000`.

---

## 📄 License & Community Charter

This project is licensed under the **MIT License**.  
Built as an open-source civic public good for local communities. Zero data monetization, zero transaction commissions.
