# Milestone 32: Login Redirect Toast Deduplication

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents resolving the duplicate warning toast notification bug that occurred upon redirection to the Login page in React/Next.js development environments under Strict Mode.

---

## 1. Bug Diagnosis

*   **Cause:** In React development environments, Strict Mode intentionally mounts components twice to help identify side effects. Consequently, the redirect warning effect hook was executing twice, spawning duplicate toast instances.
*   **Result:** The customer was greeted with two identical stack toast warning messages ("Please login first to book a room.").

---

## 2. Bug Resolution

*   **Deduplication Options:** Configured a static, unique `toastId` parameter inside the options argument of the `toast.warn()` trigger:
    ```typescript
    useEffect(() => {
      if (next && next.startsWith("/book")) {
        toast.warn("Please login first to book a room.", {
          toastId: "login-to-book",
        });
      }
    }, [next]);
    ```
*   **Result:** React-Toastify automatically matches the identifier `login-to-book` and blocks duplicate instances from rendering concurrently, rendering exactly one warning toast.
