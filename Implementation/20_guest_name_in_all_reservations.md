# Milestone 20: Guest Name in All Reservations List

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents resolving the issue where guest names were blank in the Reservations tab when viewing the unfiltered "All Reservations" list.

---

## 1. Bug Diagnosis

*   **Cause:** In `app/staff/page.tsx`, viewing "All Reservations" queries the primary `/reservations` index endpoint.
*   **Missing Relation:** The `index()` method inside [`app/Http/Controllers/ReservationController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReservationController.php) only loaded the `room.hotel` and `payment` relationships. It did not eager-load the `user` relation.
*   **Result:** As a result, the `user` object was undefined in the paginated JSON payload, leaving the table's guest column (`reservation.user?.name`) blank.

---

## 2. Bug Resolution

Modified [`app/Http/Controllers/ReservationController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReservationController.php) to eager-load the user profile dataset:
*   **Eager Load Query Update:**
    ```php
    $query = Reservation::with(['room.hotel', 'payment', 'user']);
    ```
*   **Result:** Guest user profiles now resolve correctly across all list views.
