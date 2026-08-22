# Milestone 8: Ancillary Services & Promotional Code Checkout Integration

**Date:** 21 August 2026
**Phase:** Phase 4 - Final Integration
**Status:** Complete

## Overview

This milestone introduces the **Ancillary Services** database tables, models, controllers, and APIs inside the Laravel `/backend`. It also integrates the frontend Next.js `/frontend` user interface to fetch ancillary services dynamically, select them with custom quantities, input promotion codes, and submit everything securely via Stripe during the checkout process.

---

## 1. Database & Backend Implementation (Laravel)

### A. Database Schema
Two new tables were registered to handle ancillary services:
1.  **`ancillary_services` Table:** Stores details of hotel amenities available for purchase (e.g. spa sessions, private transfers, dining buffets).
    *   Columns: `id`, `hotel_id` (FK), `name`, `category` (enum: `'dining'`, `'rental'`, `'tour'`, `'spa'`), `price` (decimal), `description` (text nullable), `is_active` (boolean), `timestamps`.
2.  **`reservation_ancillary_service` Table (Pivot):** Connects reservations to their selected ancillary services.
    *   Columns: `id`, `reservation_id` (FK), `ancillary_service_id` (FK), `quantity` (int default 1), `price_at_booking` (decimal), `timestamps`.

### B. Models & Relationships
*   **[`AncillaryService.php`](file:///d:/Book_My_Hotel/backend/app/Models/AncillaryService.php):** Defines `belongsTo(Hotel)` and `belongsToMany(Reservation)` relationships.
*   **[`Reservation.php`](file:///d:/Book_My_Hotel/backend/app/Models/Reservation.php):** Added `ancillaryServices()` relationships.
*   **[`Hotel.php`](file:///d:/Book_My_Hotel/backend/app/Models/Hotel.php):** Added `ancillaryServices()` relationships.

### C. Controller & API Routes
*   **[`AncillaryServiceController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/AncillaryServiceController.php):**
    *   `GET /api/ancillary-services` (filtered by `hotel_id`).
    *   `POST /api/ancillary-services` (admin/staff write access only).
*   **Routes Registration:** Set up inside [`api.php`](file:///d:/Book_My_Hotel/backend/routes/api.php).

### D. Booking Flow Hardening (`ReservationController@store`)
*   **Validation:** Accepts an optional array of `services` containing `{ id: int, quantity: int }`.
*   **Price Math:** Looks up each service, adds the cost (`price * quantity`) to the booking `$totalPrice` before applying promo discounts.
*   **Pivot Storage:** Saves the selected services with the quantity and price at booking to the pivot table.
*   **Response Integration:** Automatically loads `ancillaryServices` on the returned reservation model.

### E. Seeder Updates
*   **[`DatabaseSeeder.php`](file:///d:/Book_My_Hotel/backend/database/seeders/DatabaseSeeder.php):** Seeds 4 core ancillary services (*Breakfast Buffet*, *Airport Shuttle*, *City Sightseeing*, and *Full Body Massage*) for each hotel.

---

## 2. Frontend Implementation (Next.js)

The booking checkout page [`app/book/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/book/page.tsx) was completely overhauled:
1.  **Ancillary Services Selection UI:** Fetches the hotel's services and renders them as checklist cards. Selecting a service opens a quantity selector, updating the total cost in real-time.
2.  **Promo Code Validation & Calculations:** Added a promo code input and validation button. It queries `GET /api/promotions?hotel_id={id}` to search for active codes. If matched, it applies the percentage discount to the combined room + services cost.
3.  **Detailed Invoice Breakdown:** Displays Room Rate × Nights, Ancillary Services, and Promo Discounts.
4.  **Stripe Synchronization:** Submits the `services` array and the validated `promo_code` to the backend. The Stripe Element payment triggers with the finalized, discounted total.

---

## 3. Route Summary

*   **`GET /api/ancillary-services`** (Public) - Fetch active services, optionally filtered by `hotel_id`.
*   **`POST /api/ancillary-services`** (Auth: Sanctum, Staff/Admin) - Register new services.
