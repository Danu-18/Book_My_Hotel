# Milestone 16: Date Boundaries Validation

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents resolving the UI flaw where users were able to select past dates and invalid check-out dates on the hotel availability search forms.

---

## 1. Validation Logic Implementation

Implemented robust timezone-safe local date calculation constraints:
*   **Today's Date (`todayStr`):** Dynamically calculated using `new Date()` formatted explicitly into `YYYY-MM-DD` representation:
    ```typescript
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    ```
*   **Minimum Check-Out Date (`minCheckoutDate`):** If a check-in date is selected, the check-out selector's minimum date is restricted to exactly one day after check-in. If no check-in date is selected, it defaults to tomorrow:
    ```typescript
    const minCheckoutDate = checkIn
      ? (() => {
          const d = new Date(checkIn + "T00:00:00");
          d.setDate(d.getDate() + 1);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })()
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })();
    ```

---

## 2. Forms Integration

1.  **Homepage Search Form (`app/page.tsx`):**
    *   Added `min={todayStr}` to the check-in input element.
    *   Added `min={minCheckoutDate}` to the check-out input element.
    *   Configured the check-in `onChange` handler to auto-shift the check-out date forward if the selected check-in date is equal to or after the existing check-out value.
2.  **Hotel Details Availability Form (`app/hotels/[id]/page.tsx`):**
    *   Integrated matching local date calculation logic.
    *   Mapped identical boundary constraints and auto-correcting `onChange` handler checks to input tags.
3.  **Booking Form (`app/book/page.tsx`):**
    *   Verified that the booking confirmation step operates strictly via parameters passed through URL query context (`check_in` and `check_out`), meaning no interactive date controls require modification here.
