# Milestone 5b: Architectural & Authorization Fixes (Phase 1)

**Date:** 21 August 2026
**Phase:** Phase 1 - Core Backend & Database Fixes
**Status:** Complete

## Overview

This milestone documents the implementation of the core architectural, database constraint, and middleware authorization fixes inside the Laravel `/backend` environment. These modifications resolve critical database schema design bugs, off-by-one availability overlaps, validator syntax exceptions, and role access restrictions.

---

## 1. Composite Unique Constraints (Room Uniqueness)

### The Problem
The original database schema migration [`2026_08_14_182100_create_rooms_table.php`](file:///d:/Book_My_Hotel/backend/database/migrations/2026_08_14_182100_create_rooms_table.php) set a global unique index on the `rooms.room_number` column. This constraint made it impossible for different hotels (e.g., Marriott and Hilton) to both have rooms with standard designations like "101" or "102".

### The Fix
A new database migration was created to drop the global unique index and establish a composite constraint unique to each hotel property:
*   **Migration File:** [`2026_08_21_123000_change_rooms_uniqueness_constraint.php`](file:///d:/Book_My_Hotel/backend/database/migrations/2026_08_21_123000_change_rooms_uniqueness_constraint.php)
*   **Action:** Drops `rooms_room_number_unique` index and adds `$table->unique(['hotel_id', 'room_number']);`.

---

## 2. Off-by-One Availability Overlap Fix

### The Problem
Room availability validation in both [`RoomController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/RoomController.php) and [`ReservationController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReservationController.php) checked for overlaps using inclusive date operators (`whereBetween` or `<=` and `>=`). This logic incorrectly flagged rooms as unavailable when a new booking's check-in date coincided with an existing booking's check-out date (e.g. back-to-back reservations), which is standard hotel operations.

### The Fix
Rewrote availability checking queries in both files to enforce strict non-inclusive bounds checking:
*   **Query Condition:** `check_in_date < $checkOut` and `check_out_date > $checkIn`.
*   **Impact:** Allows checkout and check-in to occur on the same day without throwing a double-booking conflict error.

---

## 3. Laravel Validation Syntax Correction

### The Problem
Inside [`HotelController.php` (line 84)](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/HotelController.php#L84), the validator for the hotel `update` endpoint used the invalid rule `'enum:Marriott,Hilton,Hyatt,Four Seasons'`. This is invalid syntax in Laravel and triggered runtime exceptions whenever administrators attempted to update hotel information.

### The Fix
*   **Action:** Modified the rule to the correct Laravel list validation format:
    ```php
    'chain' => ['sometimes', 'string', 'in:Marriott,Hilton,Hyatt,Four Seasons'],
    ```

---

## 4. Role Authorization Isolation Resolution

### The Problem
The custom [`CheckRole` middleware](file:///d:/Book_My_Hotel/backend/app/Http/Middleware/CheckRole.php) used strict string matching (`role !== $role`). Because room creation and updates were protected under the `role:staff` group, administrators (`role:admin`) were locked out of adding or modifying rooms, resulting in unauthorized `403 Forbidden` API responses.

### The Fix
*   **Action:** Updated the middleware handler to permit `admin` users to pass through any role restriction check:
    ```php
    if ($request->user()->role !== $role && $request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden. You do not have access to this resource.'], 403);
    }
    ```
*   **Impact:** Admins inherit staff level privileges, allowing full room management access.
