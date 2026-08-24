# Milestone 17: Custom Cancellation Confirmation Modal

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents replacing the native browser-level `window.confirm()` alert dialog with a custom React modal on the user bookings/reservations dashboard to keep alignment with the luxury layout themes of the site.

---

## 1. State Management Changes

*   Added a state variable `reservationToCancel` to track which reservation card is marked for removal:
    ```typescript
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);
    ```
*   Configured the "Cancel Booking" button to update state:
    ```typescript
    onClick={() => setReservationToCancel(reservation.id)}
    ```

---

## 2. Modal Overlay Design

Added a theme-compliant dialog template rendered overlaying the screen whenever `reservationToCancel` is active:
*   **Backdrop Filter:** Blurs background content using `backdrop-blur-sm` and dims it with `bg-black/50`.
*   **Card Aesthetic:** Matches card structures (`bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-6`).
*   **Actions:**
    *   **Keep Booking Button:** Resets state to `null` to close the dialog.
    *   **Yes, Cancel Booking Button:** Destructive trigger using theme alert colors (`bg-destructive text-destructive-foreground`). Fires the original API POST cancellation function passing the cached reservation ID and closes the modal.

---

## 3. Toast Notifications & API Integrity

*   Preserved API call triggers identical to initial states.
*   Integrated `react-toastify` toast notifications directly into the cancellation catch block:
    *   **On Success:** Fires `toast.success("Reservation cancelled successfully.")`.
    *   **On Failure:** Fires `toast.error(errorData.response?.data?.message || "Failed to cancel reservation.")`.
