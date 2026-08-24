# Milestone 29: Role-Based Login Redirects

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents implementing automated role-based navigation loops on the Login page to forward Hotel Staff and System Admins directly to their respective enterprise management dashboards instead of landing on the customer website.

---

## 1. Modifications

In [`frontend/app/login/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/login/page.tsx):
*   **Centralized Effect Hook:** Upgraded the authenticated state hook to evaluate the user's role:
    *   **Admin Accounts:** Redirects directly to `/admin`.
    *   **Staff Accounts:** Redirects directly to `/staff`.
    *   **Customer/Guest Accounts:** Redirects to the `next` search parameter fallback or the homepage (`/`).
*   **Centralized Dispatch:** Removed direct route pushes inside `handleSubmit()`, delegating all navigation redirects to the state listener `useEffect` to ensure immediate and uniform behavior upon initial page mount or successful form submission.
