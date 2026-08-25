# Milestone 33: Login Redirect URL Encoding

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents fixing the url-parsing bug where check-in and check-out dates failed to load on the room checkout page after an unauthenticated user logged in.

---

## 1. Bug Diagnosis

*   **Cause:** The URL parameter separator character (`&`) was not URL-encoded in the nested `next` redirect query parameter (e.g. `/login?next=/book?room_id=5&check_in=...&check_out=...`).
*   **Result:** The browser interpreted the second and third parameters (`&check_in` and `&check_out`) as query parameters for the `/login` route itself, rather than parameters of the `/book` page nested inside the `next` value. When the login process succeeded and routed to `next`, those parameters were completely lost, causing the checkout page to display `Invalid Date`.

---

## 2. Bug Resolution

Wrapped the target redirect routes in `encodeURIComponent()` calls before setting them inside query parameters:
*   In **[`frontend/app/hotels/[id]/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/hotels/[id]/page.tsx)**:
    ```typescript
    href={
      user
        ? `/book?room_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}`
        : `/login?next=${encodeURIComponent(`/book?room_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}`)}`
    }
    ```
*   In **[`frontend/app/book/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/book/page.tsx)**:
    ```typescript
    router.push(`/login?next=${encodeURIComponent(`/book?room_id=${roomId}&check_in=${checkInParam}&check_out=${checkOutParam}`)}`);
    ```
*   **Result:** The query parameters are safely URL-encoded into a single string (`/book%3Froom_id%3D5%26check_in%3D...%26check_out%3D...`) during login redirection, preserving dates at checkout.
