# BookMyHotel.com

BookMyHotel.com is an enterprise-grade hotel booking platform that centralises room reservations for four luxury hotel chains (Marriott, Hilton, Hyatt, and Four Seasons) into a single customer-facing e-commerce application.

Built using a **hybrid Client-Server + MVC architecture** with a **Next.js (React)** frontend consuming a **Laravel (PHP)** REST API backend with a **MySQL** database, and **Stripe** for secure payments.

---

## Architecture

```
┌─────────────────┐         REST API          ┌──────────────────┐         MySQL
│   Next.js 16    │  ───────────────────────► │     Laravel 12   │  ────►  Database
│   (React 19)    │  ◄─────────────────────── │    (MVC Server)  │  ◄────
│    Tailwind     │      JSON Responses       │     Sanctum      │
│   Stripe.js     │                           │   Stripe SDK     │
└─────────────────┘                           └──────────────────┘
```

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- **Backend:** Laravel 12 (PHP 8.2+) with Sanctum authentication
- **Database:** MySQL 8+
- **Payments:** Stripe (Test Mode)

## Project Structure

```
BookMyHotel/
├── backend/          # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # 8 RESTful controllers
│   │   │   └── Middleware/     # CheckRole middleware
│   │   └── Models/             # 8 Eloquent models
│   ├── config/                 # Laravel configuration
│   ├── database/
│   │   ├── migrations/         # 11 migration files
│   │   └── seeders/            # Database seeder
│   └── routes/
│       └── api.php             # 36 API routes
├── frontend/         # Next.js client
│   ├── app/                    # App Router pages
│   ├── components/             # Navbar & Footer
│   ├── lib/                    # API client, auth, types
│   └── public/                 # Static assets
├── Implementation/   # Milestone documentation
└── README.md
```

## Prerequisites

- **PHP 8.2+** with Composer
- **Node.js 20+** with npm
- **MySQL 8+**
- **Stripe Account** (Test Mode keys)

## Installation

### 1. Clone & Install Dependencies

```bash
# Backend
cd backend
composer install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bookmyhotel
DB_USERNAME=root
DB_PASSWORD=

STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
```

### 3. Run Migrations & Seed Database

```bash
cd backend
php artisan migrate:fresh --seed
```

This creates the database tables and seeds:
- **4 hotels** (Marriott, Hilton, Hyatt, Four Seasons)
- **16 rooms** (4 room types per hotel)
- **4 promotions**
- **3 users**: admin, staff, customer
- **1 confirmed reservation** with payment and review

### 4. Start the Development Servers

**Terminal 1 - Backend (port 8000):**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend (port 3000):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@bookmyhotel.com` | `password123` |
| **Hotel Staff** | `staff@bookmyhotel.com` | `password123` |
| **Customer** | `customer@bookmyhotel.com` | `password123` |

## Features

### Customer
- 🔍 **Search & Filter** - Search hotels by city, chain, price, room type, dates
- 🏨 **Hotel Browsing** - Browse hotels with room availability & reviews
- 💳 **Secure Booking** - Book rooms with Stripe card payment
- 📅 **Manage Bookings** - View, cancel, and track reservation status
- ⭐ **Guest Reviews** - Read and submit hotel reviews
- 📞 **Contact Form** - Reach BookMyHotel support directly

### Hotel Staff
- 🛏️ **Room Management** - Add rooms, update prices & availability
- 📋 **Daily Bookings** - View reservations for specific dates
- 🏷️ **Promotions** - Create discount offers with promo codes

### Admin
- 📊 **Analytics Dashboard** - Room nights, revenue, average daily rate
- 🏨 **Hotel Management** - Add, edit, delete hotels
- 📋 **All Reservations** - View all bookings across hotels
- 👥 **User Management** - View registered users

## API Endpoints (36 Routes)

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| GET | `/api/hotels` | List hotels (filterable) |
| GET | `/api/hotels/{id}` | Hotel details |
| GET | `/api/rooms` | Search rooms |
| GET | `/api/promotions` | Active promotions |
| GET | `/api/reviews?hotel_id=` | Hotel reviews |
| POST | `/api/contact` | Contact form |

### Authenticated (Bearer Token)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/logout` | Auth | Logout |
| GET | `/api/me` | Auth | Current user |
| GET/POST | `/api/reservations` | Customer | Manage bookings |
| POST | `/api/reservations/{id}/cancel` | Customer | Cancel booking |
| POST | `/api/reservations/{id}/confirm` | Customer | Confirm payment |
| POST | `/api/rooms` | Staff+ | Add room |
| PUT | `/api/rooms/{id}` | Staff+ | Update room |
| POST | `/api/promotions` | Staff+ | Create promotion |
| GET | `/api/staff/reservations/by-date` | Staff | Daily view |
| PUT/DELETE | `/api/hotels/{id}` | Admin | Manage hotels |
| DELETE | `/api/rooms/{id}` | Admin | Delete room |
| GET | `/api/admin/analytics` | Admin | Dashboard data |
| GET | `/api/admin/reservations` | Admin | All bookings |
| GET | `/api/admin/users` | Admin | User list |
| GET | `/api/admin/contact-messages` | Admin | Contact inbox |

## Stripe Test Payment

Use the following test card in the checkout:
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date
- **CVC:** Any 3-digit number

## Documentation

Detailed milestone documentation is available in the `Implementation/` folder:

| File | Description |
|------|-------------|
| `01_database_migrations.md` | Database schema & ER diagram alignment |
| `02_api_controllers.md` | REST API controllers & routes |
| `03_frontend_implementation.md` | Next.js frontend implementation |

## Security

- ✅ **Role-based access control** (customer, staff, admin)
- ✅ **Laravel Sanctum** token authentication
- ✅ **Stripe PaymentIntents** - no card data stored
- ✅ **Input validation** on all API endpoints
- ✅ **Password hashing** with Bcrypt
- ✅ **CORS** configured for frontend origin only

## License

Academic project for SWE6013 Enterprise System Development - University of Bolton.