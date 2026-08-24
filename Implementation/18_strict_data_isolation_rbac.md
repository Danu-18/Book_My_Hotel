# Milestone 18: Strict Data Isolation and Role-Based Access Control (RBAC)

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents enforcing strict Data Isolation and Role-Based Access Control (RBAC) across the BookMyHotel monorepo. This prevents multi-tenant data leaks by mathematically restricting hotel `staff` users to their own hotel's inventory (Rooms, Reservations, Promotions, Ancillary Services).

---

## 1. Database & Seeder Setup

1.  **Users Schema Migration:** Created [`database/migrations/2026_08_24_160800_add_hotel_id_to_users_table.php`](file:///d:/Book_My_Hotel/backend/database/migrations/2026_08_24_160800_add_hotel_id_to_users_table.php), adding a nullable `hotel_id` foreign key referencing the `hotels` table.
2.  **User Model Updates:** Added `hotel_id` to `$fillable` in [`app/Models/User.php`](file:///d:/Book_My_Hotel/backend/app/Models/User.php) and implemented the `hotel()` BelongsTo relationship.
3.  **Database Seeder:** Refactored [`database/seeders/DatabaseSeeder.php`](file:///d:/Book_My_Hotel/backend/database/seeders/DatabaseSeeder.php) to seed hotels first, then assign designated Staff accounts to each respective hotel.

### Verification Credentials
*   **System Admin Account:**
    *   **Email:** `admin@bookmyhotel.com`
    *   **Password:** `password123`
*   **Marriott Downtown Dubai Staff:**
    *   **Email:** `marriott@staff.com`
    *   **Password:** `password123`
*   **Hilton Corniche Abu Dhabi Staff:**
    *   **Email:** `hilton@staff.com`
    *   **Password:** `password123`
*   **Hyatt Regency Istanbul Staff:**
    *   **Email:** `hyatt@staff.com`
    *   **Password:** `password123`
*   **Four Seasons London Staff:**
    *   **Email:** `fourseasons@staff.com`
    *   **Password:** `password123`
*   **Legacy Staff Account (Marriott Downtown Dubai):**
    *   **Email:** `staff@bookmyhotel.com`
    *   **Password:** `password123`

---

## 2. Backend Controller Enforcement (Laravel)

Enforced strict query boundaries across the following controllers:
*   **Room Controller:** [`app/Http/Controllers/RoomController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/RoomController.php)
    *   `index`: Forcefully appends `->where('hotel_id', $request->user()->hotel_id)` if query user is staff.
    *   `store`/`update`: Validates and forces the `hotel_id` payload override matching `$request->user()->hotel_id`.
    *   `destroy`/`update`: Blocks cross-hotel mutations by returning a `403 Forbidden` response if the room's `hotel_id` mismatch occurs.
*   **Reservation Controller:** [`app/Http/Controllers/ReservationController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReservationController.php)
    *   `index`/`byDate`: Queries reservations linked to rooms matching the staff's `hotel_id` via a `whereHas('room')` relation closure.
    *   `store`/`show`/`update`/`cancel`: Checks boundaries and denies access to details or status updates of reservations belonging to outside hotels.
*   **Promotion Controller:** [`app/Http/Controllers/PromotionController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/PromotionController.php)
    *   `index`: Limits returned discounts to the staff user's hotel.
    *   `store`/`update`/`destroy`: Restricts modifications and validates boundaries.
*   **Ancillary Service Controller:** [`app/Http/Controllers/AncillaryServiceController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/AncillaryServiceController.php)
    *   `index`/`store`/`update`/`destroy`: Full isolation rules implemented.

---

## 3. Frontend Coordination (Next.js)

1.  **TypeScript User Definition:** Updated `User` model interface in [`frontend/lib/types.ts`](file:///d:/Book_My_Hotel/frontend/lib/types.ts) to declare the optional `hotel_id` parameter.
2.  **Staff Dashboard Facelift:** Modified [`frontend/app/staff/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/staff/page.tsx):
    *   Removed manual "Hotel" selector dropdowns from the "Add New Room" and "Create Promotion" forms.
    *   Configured submission actions to automatically inject the authenticated user's `hotel_id` from auth context.
