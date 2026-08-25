# Milestone 38: Replace Native Alerts and Confirms

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents replacing all native browser `alert()` and `confirm()` calls with `react-toastify` toast notifications (for messages) and custom backdrop-blurred confirmation modals (for user confirmations) to match the overall web UI theme.

---

## 1. Modifications

### 1.1 Simple Notifications
Replaced simple informational `alert()` statements with `toast.success` and `toast.error`:
*   **[`frontend/app/admin/hotels/[id]/edit/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/admin/hotels/%5Bid%5D/edit/page.tsx):** Replaced success alert on hotel edit submit with `toast.success("Hotel updated successfully!");`.
*   **[`frontend/app/admin/hotels/new/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/admin/hotels/new/page.tsx):** Replaced success alert on hotel create submit with `toast.success("Hotel created successfully!");`.
*   **[`frontend/app/hotels/[id]/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/hotels/%5Bid%5D/page.tsx):** Replaced availability error alert with `toast.error("Failed to check room availability. Please try again.");`.

### 1.2 Binary Confirms
Replaced window-blocking `window.confirm()` messages with state-driven custom confirmation overlay dialog modals matching the theme UI:
*   **[`frontend/app/admin/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/admin/page.tsx):**
    *   Added state variables: `hotelToDelete` (number | null) and `roomToDelete` (number | null).
    *   Set the delete buttons to update these states instead of running the actions immediately.
    *   Created overlay popups rendered conditionally at the bottom of the JSX tree, prompting the user for approval before performing the actual delete calls.
