# Milestone 37: Add Room Image URL Field

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents adding a Room Image URL input field to the room creation form on both the Hotel Staff and System Admin Dashboards.

---

## 1. Modifications

In [`frontend/app/staff/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/staff/page.tsx) and [`frontend/app/admin/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/admin/page.tsx):
*   **Form State Integration:** Added the `image_url` property to the `roomForm` state hook:
    ```typescript
    const [roomForm, setRoomForm] = useState({
      ...
      image_url: "",
    });
    ```
*   **API Payload Dispatch:** Eagerly included `image_url` inside the Axios POST request body when calling `POST /api/rooms` inside `handleRoomSubmit`.
*   **Form Reset Call:** Reset the `image_url` parameter back to an empty string inside the `setRoomForm` reset trigger after successful room creation.
*   **UI Input Field Integration:** Formed an input element mapped directly to the `image_url` property with custom placeholders right before the Submit buttons.
