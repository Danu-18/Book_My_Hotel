# Milestone 10: Admin Promotion Visibility & Filter Fix

**Date:** 24 August 2026  
**Phase:** Phase 2 - Backend Bug Fix  
**Status:** Complete  

## Overview

This milestone fixes a bug where newly created or updated promotions would disappear from the administrator's promotions management list under certain conditions (such as future start dates, past dates, or inactive statuses).

## Cause of the Bug

In the backend controller [`PromotionController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/PromotionController.php), the `index` method was originally structured to isolate data only for `staff` users. If the user was not `staff` (which includes `admin`), the backend applied customer-facing filters:
1. `is_active` must be `true`.
2. The promotion date range must overlap with `today` (`start_date <= today` and `end_date >= today`).

As a result, if an administrator created or updated a promotion with a future start date (e.g., for a winter or holiday sale), or an inactive promotion, the backend immediately excluded it from subsequent `GET /api/promotions` responses, causing it to "disappear" from the admin view.

## Solution

We modified [`PromotionController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/PromotionController.php) to grant the `admin` user the same management visibility bypass that `staff` has:

```diff
         // Enforce strict data isolation for staff
         $user = $request->user('sanctum');
-        if ($user && $user->role === 'staff') {
-            $query->where('hotel_id', $user->hotel_id);
+        if ($user && ($user->role === 'staff' || $user->role === 'admin')) {
+            if ($user->role === 'staff') {
+                $query->where('hotel_id', $user->hotel_id);
+            } else {
+                // Admin can filter by hotel if query param is passed
+                if ($request->has('hotel_id')) {
+                    $query->where('hotel_id', $request->input('hotel_id'));
+                }
+            }
         } else {
             $query->where('is_active', true);
```

- When the authenticated user is an `admin`, the backend bypasses all public active and validity date-range filters.
- Administrators can now view, update, and manage draft, future, active, and expired promotions for any hotel chain without them disappearing.

## Files Modified

| File Path | Description |
|-----------|-------------|
| [`app/Http/Controllers/PromotionController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/PromotionController.php) | Updated the `index` method to bypass date/active filters for administrators. |

## Verification

- Logged in as Admin.
- Added a promotion with a future `start_date` (e.g., next month).
- Verified the promotion remains visible in the list under the "Manage Promotions" tab.
- Edited a promotion to be in the past or updated the date criteria, and verified it continues to show up in the Admin list.
