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
*   **Rooms (`rooms`):** `id` (PK), `hotel_id` (FK → `hotels.id`, cascade), `room_type`, `room_number`, `capacity`, `price_per_night` (decimal), `total_rooms`, `available_rooms`, `amenities` (JSON list), `is_active` (boolean). *(Note: Composite unique index on `['hotel_id', 'room_number']`)*
*   **Reservations (`reservations`):** `id` (PK), `user_id` (FK → `users.id`, cascade), `room_id` (FK → `rooms.id`, cascade), `check_in_date` (date), `check_out_date` (date), `guests`, `total_price` (decimal), `status` (enum: `pending`,`confirmed`,`cancelled`,`completed`).
*   **Payments (`payments`):** `id` (PK), `reservation_id` (FK → `reservations.id`, cascade), `user_id` (FK → `users.id`, cascade), `stripe_payment_intent_id` (unique), `amount` (decimal), `currency` (AED), `status` (enum: `pending`,`succeeded`,`failed`,`refunded`), `payment_method` (string).
*   **Promotions (`promotions`):** `id` (PK), `hotel_id` (FK → `hotels.id`), `title`, `description`, `discount_percentage`, `start_date`, `end_date`, `code` (unique), `is_active` (boolean).
*   **Reviews (`reviews`):** `id` (PK), `user_id` (FK → `users.id`), `hotel_id` (FK → `hotels.id`), `rating` (int), `comment`.
*   **Contact Messages (`contact_messages`):** `id` (PK), `name`, `email`, `subject`, `message`, `is_read`.
*   **Ancillary Services (`ancillary_services`):** `id` (PK), `hotel_id` (FK → `hotels.id`, cascade), `name`, `category` (enum: `dining`, `rental`, `tour`, `spa`), `price` (decimal), `description` (text nullable), `is_active` (boolean).
*   **Reservation Services (`reservation_ancillary_service`):** `id` (PK), `reservation_id` (FK → `reservations.id`, cascade), `ancillary_service_id` (FK → `ancillary_services.id`, cascade), `quantity` (int default 1), `price_at_booking` (decimal).

**Relationships:**
*   `Hotel` hasMany `Room`, `Promotion`, `Review`, `AncillaryService`
*   `User` hasMany `Reservation`, `Payment`, `Review`
*   `Room` hasMany `Reservation`
*   `Reservation` hasOne `Payment`, belongsToMany `AncillaryService` (via pivot)

## 3. API & Auth Flow
*   **Authentication:** Stateless Token Auth via Laravel Sanctum.
    *   `POST /api/register` and `POST /api/login` issue Sanctum plain text tokens.
    *   Tokens are attached in Next.js via Axios Request Interceptor: `Authorization: Bearer <token>`.
    *   401 unauthorized responses are caught by Axios Response Interceptor to clear storage and redirect to `/login`.
*   **Stripe Payment Flow:**
    1.  Client submits reservation: `POST /api/reservations` (including optional array of `{ id: service_id, quantity: qty }` and `promo_code`).
    2.  Server verifies room date availability, sums room rate + selected ancillary services cost, applies valid promotional code discount, creates a `pending` reservation, generates a Stripe PaymentIntent with the discounted total, creates a `pending` Payment, and returns `client_secret` to Client.
    3.  Client captures card details securely via `Stripe.js` / `CardElement` and calls `stripe.confirmCardPayment()`.
    4.  Client calls `POST /api/reservations/{id}/confirm`.
    5.  Server retrieves PaymentIntent status via Stripe API. If `succeeded`, updates Reservation status to `confirmed` and Payment status to `succeeded`.

## 4. Current Codebase State

### Working Features (All Core Architecture Bugs Resolved)
*   **Stateless Authentication:** Sanitized and operational token-based user registrations/logins.
*   **Hotel & Room Searching:** Clean availability check query using strictly non-inclusive date overlap comparison (`check_in_date < $checkOut` and `check_out_date > $checkIn`), allowing checkout day = check-in day bookings.
*   **Ancillary Services:** Database schemas, backend relations, and a checklist/card selection UI built to add services (buffets, tours, transfers, massages) with custom quantities to bookings.
*   **Promotional Codes:** Checkout form inputs and discount calculation math integrated. Submitting code queries promotions table, checks dates and hotel criteria, and subtracts discount from room + services cost.
*   **Stripe Payment & Refunds:** Secured card captures via Stripe.js. Validated refunds via Stripe Refund creation class (`\Stripe\Refund::create()`) on succeeded payment intentions.
*   **Admin Panel UIs:** Interactive KPI statistics dashboard, all reservations list, and custom creations/modifications pages built under `/admin/hotels` to resolve 404s.
*   **Authorization Alignment:** Middleware `CheckRole.php` updated to allow `admin` users to pass specific route role blocks (inheriting staff controls).
*   **Standard Tailwind UI Facelift:** Integrated pre-built cards, layouts, and standard Tailwind CSS / shadcn properties across all primary pages (Home, Details, Checkout, Staff, Admin) to ensure clean compatibility, integrated `react-toastify` on auth pages, resolved the `401` login redirect loop reload bug, added dynamic date constraints with auto-correction to availability search forms, replaced the browser `window.confirm` with a custom React modal on the reservations page, enforced strict multi-tenant Data Isolation and RBAC, integrated dynamic all-reservations/by-date filters on the staff dashboard, fixed the missing eager-loaded guest name relation, resolved public endpoint staff data leaks using explicit Sanctum user resolution, replaced native browser alerts with `react-toastify` notifications, implemented HTML5 min date bounds and auto-correction hooks for start/end dates on the staff promotion form, integrated Edit and Cancel/Delete action triggers, replaced native browser confirm alerts with custom theme-compliant modals, migrated the promotions delete route to the staff middleware block, bypassed date validity constraints on the index endpoint for staff users, built a dedicated enterprise sidebar dashboard layout for the staff panel utilizing Client Component wrappers (`LayoutWrapper.tsx`) to conditionally hide standard headers and footers, implemented automated role-based navigation loops to redirect staff and admin accounts directly to their dashboards upon login, resolved UTC server timezone discrepancies by implementing timezone-aware date validations mapped to each hotel's city location during promo code verification, introduced deduplicated warning toast notifications utilizing unique `toastId` parameters on the login page when unauthenticated users attempt to navigate to booking checkout paths, URL-encoded checkout redirect parameters on hotel details and booking validation pages to prevent loss of check-in/check-out dates during authentication forwarding, added a secure "Leave Review" modal and submission trigger for completed reservations on the customer bookings page, replaced auto-save on-blur triggers with explicit manual "Update" action buttons inside rooms inventory tables across both Staff and Admin dashboards, styled the room actions with solid/bordered padded pill tags to make them distinct and visible, integrated a "Room Image URL" field inside the room creation forms of the Staff and Admin dashboards, replaced all native browser alert() and confirm() boxes with react-toastify alerts and custom theme-compliant popups, created a comprehensive repository README.md, rewrote the database seeder to establish a heavy set of realistic evaluation records (exactly 4 hotels, 6 customers, 20 rooms, 6 promotions, 24 ancillary services, 6 reservations of all status values, and 2 reviews) for grading the BookMyHotel platform, added a room_id nullable foreign key column to the reviews database table, mapping it in the Review model, saving it on submission, seeding multiple dummy room-specific reviews, and configured specific login validation error responses to differentiate between missing accounts ("Account does not exist") and invalid passwords ("Invalid credentials").

### Recommended Production Optimizations (For future iterations)
*   **Stripe Webhook Listener:** Build an endpoint to verify PaymentIntent transactions asynchronously to prevent unconfirmed successes when users drop off mid-checkout.
*   **HTTPS Enforcement:** Enforce global TLS redirects and disable debug state (`APP_DEBUG=false`) in production.
*   **Token Expiration:** Establish short-lived tokens with refresh rotation.

## 5. Development Constraints
*   **Architecture Integrity:** Strictly adhere to the hybrid Client-Server/MVC pattern. Next.js handles presentation and client-side routing; Laravel manages validation, business rules, and database communication. Do not perform DB actions directly from frontend.
*   **Strict Security:** Never bypass Sanctum token authentication. Enforce request validation rules on all write endpoints. Ensure resource ownership is checked (e.g. users cannot cancel/view others' reservations).
*   **Stripe Integration:** Never store card numbers, CVC, or expiry details in the MySQL database. Store only the Stripe `stripe_payment_intent_id`.
*   **No Hallucinations:** Do not implement features outside the specified scope unless structural rules and logic are clearly detailed in the master requirements.
