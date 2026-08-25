# Milestone 34: Completed Bookings Leave Review Feature

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents implementing the "Leave Review" feature exclusively for completed bookings on the customer's "My Bookings" page.

---

## 1. Modifications

### 1.1 Backend Enforcements
In [`ReviewController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReviewController.php):
*   **Validation Payload:** Updated the store request validation to require `hotel_id`, `room_id`, and `reservation_id`.
*   **Stay Verification:** Verifies that a reservation matching the payload is associated with the authenticated user, is in `'completed'` status, and maps to the requested room and hotel:
    ```php
    $reservation = \App\Models\Reservation::with('room')->where('id', $validated['reservation_id'])
        ->where('user_id', $request->user()->id)
        ->where('room_id', $validated['room_id'])
        ->where('status', 'completed')
        ->first();
    ```

### 1.2 Frontend Trigger & Modal Integration
In [`frontend/app/reservations/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/reservations/page.tsx):
*   **Decoupled Leave Review Button:** Rendered the "Leave Review" button exclusively inside the `completed` reservations cards.
*   **Double Submission Prevention:** Utilizes a react state array `reviewedReservationIds` (cached inside browser's `localStorage` for cross-session persistence) to immediately replace the submit button with a "Reviewed" indicator after submission to block repeat reviews for the same stay.
*   **Review Dialog Component:** Formed a modal overlay asking for a star selection (1 to 5) and feedback details. Submitting executes an Axios `POST` request to `/api/reviews`.
