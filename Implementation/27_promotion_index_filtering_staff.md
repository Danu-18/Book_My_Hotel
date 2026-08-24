# Milestone 27: Promotion Index Filtering for Staff

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents fixing the issue where newly added or updated promotions (specifically those starting in the future or set to inactive) failed to display in the staff dashboard promotion inventory list.

---

## 1. Bug Diagnosis

*   **Cause:** In [`PromotionController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/PromotionController.php), the `index()` query was hard-constrained with `where('is_active', true)` and date ranges (`start_date <= today` AND `end_date >= today`).
*   **Result:** When staff created future promotions (e.g. starting tomorrow) or set a promotion to inactive, it was instantly excluded from the JSON output of `/promotions`, making it disappear from the dashboard listing and preventing management.

---

## 2. Bug Resolution

*   **Differentiated Queries:** Updated [`PromotionController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/PromotionController.php) to bifurcate public and staff requests:
    *   **Staff Requests:** Bypasses all date range and active status checks, returning **all** promotions (active, inactive, future, past) belonging to their hotel.
    *   **Public Guest Requests:** Keeps the strict validity filters (`is_active = true`, `start_date <= today`, `end_date >= today`) active so customers only see currently active and valid discounts.
