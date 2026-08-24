# Milestone 21: Public Endpoints Sanctum Authentication

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents fixing the issue where public endpoint index requests (Rooms, Promotions, Ancillary Services) did not enforce staff user data isolation checks.

---

## 1. Bug Diagnosis

*   **Cause:** The index endpoints (e.g. `/promotions`, `/rooms`, `/ancillary-services`) are declared as public routes (outside of the `auth:sanctum` middleware routing block in Laravel).
*   **Result:** Requests hitting these public endpoints do not trigger Laravel's default Sanctum authentication guard. Consequently, calling `$request->user()` always returned `null`, preventing the backend from identifying that the request originated from a logged-in staff member, which bypassed the hotel data isolation checks and displayed all hotels' promotions.

---

## 2. Bug Resolution

Modified the `index` method in [`RoomController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/RoomController.php), [`PromotionController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/PromotionController.php), and [`AncillaryServiceController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/AncillaryServiceController.php) to eager-resolve authentication manually:
*   **Sanctum Guard Explicit Call:** Swapped `$request->user()` with `$request->user('sanctum')`. This explicitly queries the Sanctum authentication provider utilizing the Bearer token supplied in the request header, successfully identifying staff credentials without requiring route protection middleware.
*   **Result:** Staff dashboard promotion lists, rooms inventory tables, and services panels now isolate records belonging exclusively to the authenticated staff member's hotel.
