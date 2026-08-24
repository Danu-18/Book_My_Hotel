# Milestone 15: Login Page Reload Bugfix

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents fixing the issue where submitting invalid credentials on the Login page causes the page to reload instead of rendering a toast error notification.

---

## 1. Bug Diagnosis

The issue was caused by the global Axios response interceptor in [`frontend/lib/api.ts`](file:///d:/Book_My_Hotel/frontend/lib/api.ts). When invalid credentials were submitted:
1.  The Laravel backend correctly returned a `401 Unauthorized` response.
2.  The response interceptor caught the `401` status and executed:
    ```typescript
    window.location.href = "/login";
    ```
3.  Since the user was already on the `/login` route, setting the window location path to `/login` forced a full browser reload.
4.  This reload tore down the React state machine, preventing the catch block inside the login page's `handleSubmit` form handler from executing and displaying the error toast.

---

## 2. Bug Resolution

Modified [`frontend/lib/api.ts`](file:///d:/Book_My_Hotel/frontend/lib/api.ts) to check the current window pathname:
*   **Condition:** Only trigger the token purge and location redirect if the user is **not** on the `/login` or `/register` paths.
*   **Behavior:** Local authentication forms now intercept `401` response exceptions and show friendly `toast.error()` notifications without forcing full browser reloads.
