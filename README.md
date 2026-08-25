# BookMyHotel Enterprise Booking System

BookMyHotel is an enterprise-grade multi-tenant hotel room reservation and management application. It features a responsive Next.js frontend styled with Tailwind CSS, backed by a robust Laravel API handler.

---

## Prerequisites

Before starting the setup, ensure you have the following installed on your machine:
*   **PHP** 8.2 or higher
*   **Composer** (PHP dependency manager)
*   **Node.js** v18 or higher & **npm**
*   **MySQL** or another compatible relational database engine

---

## Database Setup

You can set up the database using either of the following two methods:

### Option A: Import Pre-seeded SQL Dump (Recommended)
A pre-seeded MySQL dump is provided in the repository with all evaluation dummy records.
1. Create a fresh MySQL database on your local server:
   ```sql
   CREATE DATABASE book_my_hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import the SQL file `Database/book_my_hotel.sql` into your database:
   ```bash
   mysql -u your_database_username -p book_my_hotel < Database/book_my_hotel.sql
   ```

### Option B: Fresh Migration and Seeding
1. Create a fresh MySQL database on your local server:
   ```sql
   CREATE DATABASE book_my_hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Run database migrations and seeders manually (see Step 7 in the Backend Setup below).

---

## Backend Setup (Laravel)

1. Open your terminal and navigate into the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install PHP package dependencies:
   ```bash
   composer install
   ```

3. Duplicate the template environment file to create your active configurations:
   ```bash
   copy .env.example .env
   ```
   *(On Unix/macOS systems, use `cp .env.example .env`)*

4. Open the newly created `.env` file in your text editor and update your database credentials to match your local setup:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=bookmyhotel
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   ```

5. Update the Stripe payment keys in the `.env` file to support reservation processing:
   ```env
   STRIPE_KEY=pk_test_51NgD1iSDR6VREqL3iOQ4...
   STRIPE_SECRET=sk_test_51NgD1iSDR6VREqL3O...
   ```

6. Generate the application encryption key:
   ```bash
   php artisan key:generate
   ```

7. (Optional - Only if you selected Option B in Database Setup) Run database migrations and seeders manually to populate tables:
   ```bash
   php artisan migrate:fresh --seed
   ```

8. Launch the Laravel development server:
   ```bash
   php artisan serve
   ```
   *The backend API will be served at `http://127.0.0.1:8000`.*

---

## Frontend Setup (Next.js)

1. In a new terminal tab/window, navigate into the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install Node.js package dependencies:
   ```bash
   npm install
   ```

3. Duplicate the template environment file to configure frontend endpoints:
   ```bash
   copy .env.example .env.local
   ```
   *(On Unix/macOS systems, use `cp .env.example .env.local`)*

4. Open `.env.local` and verify that the API base URL and Stripe public keys are set correctly:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51NgD1iSDR6VREqL3iOQ4...
   ```

5. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will be served at `http://localhost:3000`.*

---

## Test Credentials

Use these seeded credentials to evaluate different role privileges:

### 1. Global Admin Account
*   **Role:** Administrative control over all hotels, rooms, users, and booking logs.
*   **Email:** `admin@bookmyhotel.com`
*   **Password:** `password123`

### 2. Hotel Staff / Manager Accounts
*   **Role:** Manage rooms inventory, create promotions, and review reservations for their assigned hotel.
*   *   **Marriott Manager:**
        *   **Email:** `marriott@staff.com`
        *   **Password:** `password123`
    *   **Hilton Manager:**
        *   **Email:** `hilton@staff.com`
        *   **Password:** `password123`
    *   **Hyatt Manager:**
        *   **Email:** `hyatt@staff.com`
        *   **Password:** `password123`
    *   **Four Seasons Manager:**
        *   **Email:** `fourseasons@staff.com`
        *   **Password:** `password123`
    *   **Generic Staff:**
        *   **Email:** `staff@bookmyhotel.com`
        *   **Password:** `password123`

### 3. Customer Account
*   **Role:** Browse hotels, apply discount promotions, add ancillary services, book rooms, checkout via Stripe, cancel bookings, and leave reviews.
*   **Email:** `customer@bookmyhotel.com`
*   **Password:** `password123`

---

## Stripe Payment Testing

Use Stripe's official mock test card to simulate the booking checkout flow:
*   **Card Number:** `4242 4242 4242 4242`
*   **Expiration Date:** Any future date (e.g., `12/28`)
*   **CVC:** Any 3-digit number (e.g., `242`)
*   **ZIP/Postal Code:** Any valid code (e.g., `10001` or `90210`)