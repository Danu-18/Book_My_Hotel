# Milestone 26: Moving Delete Promotions Route to Staff Middleware Group

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents resolving the `403 Forbidden` response encountered when a staff user attempted to delete a promotion from the staff dashboard.

---

## 1. Bug Diagnosis

*   **Cause:** In [`routes/api.php`](file:///d:/Book_My_Hotel/backend/routes/api.php), the route `DELETE /promotions/{promotion}` was nested inside the `role:admin` middleware routing group.
*   **Result:** Because the logged-in user had a `staff` role, the `CheckRole` middleware threw an unauthorized response (`403 Forbidden`) before the request could reach the `destroy` method inside `PromotionController.php`.

---

## 2. Bug Resolution

*   **Routing Update:** Moved the `DELETE /promotions/{promotion}` route inside the `role:staff` middleware routing group in [`routes/api.php`](file:///d:/Book_My_Hotel/backend/routes/api.php).
*   **Access Control:** Because the custom `CheckRole` middleware automatically permits `admin` roles to pass staff routes, moving it here ensures both **Hotel Staff** and **System Admins** can delete promotions successfully.
*   **Data Isolation Integrity:** The `destroy` action in `PromotionController.php` remains fully isolated, rejecting requests from staff attempting to delete promotions belonging to other hotels.
