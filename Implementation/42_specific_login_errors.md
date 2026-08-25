# Milestone 42: Specific Login Validation Errors

**Date:** 25 August 2026
**Phase:** Phase 6 - Production Readiness
**Status:** Complete

## Overview

This milestone documents improving error handling on the login page to distinguish between accounts that do not exist (email not found) and accounts with invalid passwords.

---

## 1. Modifications

In [`AuthController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/AuthController.php):
*   **User Check:** Added a check to check if a user with the provided email exists in the database before running `Auth::attempt()`.
*   **Response Coding:**
    *   If no matching user exists: Returns a `404 Not Found` response with message: `'Account does not exist.'`
    *   If the user exists but the password is incorrect: Returns a `401 Unauthorized` response with message: `'Invalid credentials.'`
*   **Toast Alert Rendering:** The frontend automatically extracts this message from the backend API response and displays it in the Toast notification.
