# Milestone 25: Custom Confirmation Modals on Staff Dashboard

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents replacing standard browser `window.confirm()` popups with custom modal overlays on the hotel staff dashboard for both reservations cancellation and promotions deletion, aligning them with the luxury slate aesthetic of the application.

---

## 1. Modifications

In [`frontend/app/staff/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/staff/page.tsx):
*   **State Additions:**
    *   `reservationToCancel`: Stores the active reservation ID pending cancellation.
    *   `promoToDelete`: Stores the active promotion ID pending deletion.
*   **Decoupled Action Triggers:**
    *   Tapping the list action buttons now merely sets the state pointers to reveal the modals.
    *   Confirming action in the modal fires the corresponding API execution methods (`executeCancelReservation` / `executeDeletePromo`).
*   **Theme Integration:** Created clean backdrop-blur overlays matching the exact luxury UI design tokens (rounded corners, dark muted overlays, clear font sizes, and custom red primary actions).
