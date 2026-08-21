# AI Onboarding Context: BookMyHotel Monorepo

## 1. Stack & Directory Structure
*   **Tech Stack:**
    *   **Frontend:** Next.js 16.3.1 (App Router), React 19.2.8, Tailwind CSS v4, Axios 1.19, Stripe.js
    *   **Backend:** Laravel 12, PHP 8.2+, Laravel Sanctum (Token Auth), Stripe PHP SDK (Test Mode)
    *   **Database:** MySQL (bookmyhotel)

*   **Structure:**
    ```
    /backend/                    # Laravel REST API (JSON only, MVC)
    ├── app/Http/Controllers/    # Resource controllers
    ├── app/Http/Middleware/     # Custom role middleware (CheckRole.php)
    ├── app/Models/              # Eloquent Models (User, Hotel, Room, Reservation, Payment, etc.)
    ├── database/migrations/     # MySQL schemas
    └── routes/api.php           # REST routes definition
    /frontend/                   # Next.js Client App (Tailwind CSS)
    ├── app/                     # Page routes (admin, book, contact, hotels, reservations, staff)
    ├── components/              # Shared UI components (Navbar, Footer)
    └── lib/                     # API client (api.ts), Auth Context (auth-context.tsx), types (types.ts)
    ```

## 2. Database Schema & Relationships
*   **Users (`users`):** `id` (PK), `name`, `email` (unique), `password` (Bcrypt, 12 rounds), `role` (enum: `customer`,`staff`,`admin`), `phone`.
*   **Hotels (`hotels`):** `id` (PK), `name`, `chain` (Marriott/Hilton/Hyatt/Four Seasons), `location`, `city`, `country`, `description`, `star_rating` (default 5), `image_url`, `amenities` (JSON list), `latitude`/`longitude` (decimal).
*   **Rooms (`rooms`):** `id` (PK), `hotel_id` (FK → `hotels.id`, cascade), `room_type`, `room_number` (unique), `capacity`, `price_per_night` (decimal), `total_rooms`, `available_rooms`, `amenities` (JSON list), `is_active` (boolean).
*   **Reservations (`reservations`):** `id` (PK), `user_id` (FK → `users.id`, cascade), `room_id` (FK → `rooms.id`, cascade), `check_in_date` (date), `check_out_date` (date), `guests`, `total_price` (decimal), `status` (enum: `pending`,`confirmed`,`cancelled`,`completed`).
*   **Payments (`payments`):** `id` (PK), `reservation_id` (FK → `reservations.id`, cascade), `user_id` (FK → `users.id`, cascade), `stripe_payment_intent_id` (unique), `amount` (decimal), `currency` (AED), `status` (enum: `pending`,`succeeded`,`failed`,`refunded`), `payment_method` (string).
*   **Promotions (`promotions`):** `id` (PK), `hotel_id` (FK → `hotels.id`), `title`, `description`, `discount_percentage`, `start_date`, `end_date`, `code` (unique), `is_active` (boolean).
*   **Reviews (`reviews`):** `id` (PK), `user_id` (FK → `users.id`), `hotel_id` (FK → `hotels.id`), `rating` (int), `comment`.
*   **Contact Messages (`contact_messages`):** `id` (PK), `name`, `email`, `subject`, `message`, `is_read`.

**Relationships:**
*   `Hotel` hasMany `Room`, `Promotion`, `Review`
*   `User` hasMany `Reservation`, `Payment`, `Review`
*   `Room` hasMany `Reservation`
*   `Reservation` hasOne `Payment`

## 3. API & Auth Flow
*   **Authentication:** Stateless Token Auth via Laravel Sanctum.
    *   `POST /api/register` and `POST /api/login` issue Sanctum plain text tokens.
    *   Tokens are attached in Next.js via Axios Request Interceptor: `Authorization: Bearer <token>`.
    *   401 unauthorized responses are caught by Axios Response Interceptor to clear storage and redirect to `/login`.
*   **Stripe Payment Flow:**
    1.  Client submits reservation: `POST /api/reservations`
    2.  Server verifies room date availability, creates a `pending` reservation, generates a Stripe PaymentIntent, creates a `pending` Payment, and returns `client_secret` to Client.
    3.  Client captures card details securely via `Stripe.js` / `CardElement` and calls `stripe.confirmCardPayment()`.
    4.  Client calls `POST /api/reservations/{id}/confirm`.
    5.  Server retrieves PaymentIntent status via Stripe API. If `succeeded`, updates Reservation status to `confirmed` and Payment status to `succeeded`.

## 4. Current Codebase State

### Working Features
*   Full Sanctum-based user registration, login, and session persistence.
*   Hotel list and details page.
*   Contact page form submissions.
*   Basic room listings and bookings.
*   Stripe payment intent creation (Test Mode) and payment completion UI.
*   Reservations list for customers with filter badges.
*   Admin analytics calculations (KPI summaries) and global reservations list.
*   Staff dashboards to add rooms and configure promotions.

### Critical Discrepancies & Flaws (Priority Fixes)
1.  **Globally Unique Room Numbers:** `rooms.room_number` is uniquely constrained globally. Must change to unique per hotel: `unique(['hotel_id', 'room_number'])`.
2.  **Off-by-One Booking Conflicts:** Rooms are incorrectly flagged as unavailable for back-to-back bookings on the same day due to inclusive check-in/out bounds in queries. Needs non-inclusive queries (`check_in_date < $checkOut` and `check_out_date > $checkIn`).
3.  **Invalid Laravel Validator Rule:** `HotelController@update` uses the invalid validator rule syntax `enum:Marriott,Hilton,Hyatt,Four Seasons` instead of `in:Marriott,Hilton,...`, crashing updates.
4.  **Stripe Refund Bug:** `ReservationController@cancel` calls `$paymentIntent->cancel()` on succeeded payments. Succeeded intents cannot be cancelled; they must be refunded via `\Stripe\Refund::create`.
5.  **Missing Frontend Admin Pages:** Links to add/edit hotels redirect to missing pages `/admin/hotels/new` and `/admin/hotels/[id]/edit` resulting in 404s.
6.  **No Promotional Discounts:** Code does not apply active promotion codes to reduce `total_price` during reservation creation.
7.  **No Ancillary Services:** No database schemas or UI elements exist to fulfill the booking of ancillary services (spa, tours, rentals).
8.  **Client-Side Confirmation Vulnerability:** Confirmations depend on the browser successfully calling `/confirm`. No webhook listener exists for asynchronous confirmations.

## 5. Development Constraints
*   **Architecture Integrity:** Strictly adhere to the hybrid Client-Server/MVC pattern. Next.js handles presentation and client-side routing; Laravel manages validation, business rules, and database communication. Do not perform DB actions directly from frontend.
*   **Strict Security:** Never bypass Sanctum token authentication. Enforce request validation rules on all write endpoints. Ensure resource ownership is checked (e.g. users cannot cancel/view others' reservations).
*   **Stripe Integration:** Never store card numbers, CVC, or expiry details in the MySQL database. Store only the Stripe `stripe_payment_intent_id`.
*   **No Hallucinations:** Do not implement features outside the specified scope (e.g., eco-friendly reward points) unless structural rules and logic are clearly detailed in the master requirements.
