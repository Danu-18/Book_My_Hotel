# Milestone 31: Login Redirect Toast Alert

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents adding a toast notification warning when an unauthenticated customer attempts to book a hotel room and is redirected to the login page.

---

## 1. Modifications

In [`frontend/app/login/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/login/page.tsx):
*   **Redirect Observer Effect:** Added an effect hook checking the `next` search query parameter:
    ```typescript
    useEffect(() => {
      if (next && next.startsWith("/book")) {
        toast.warn("Please login first to book a room.");
      }
    }, [next]);
    ```
*   **Behavioral Flow:** When an unauthenticated user clicks a "Book" link or is redirected during booking initialization, they land on `/login?next=/book...`. The hook matches this condition and fires a warning notification using `react-toastify` to explain why the user was redirected.
