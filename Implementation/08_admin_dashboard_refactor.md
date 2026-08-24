# Milestone 8: Admin Dashboard Refactor — Sidebar Layout & Cross-Property Management

**Date:** 24 August 2026
**Phase:** Phase 3 - Frontend Implementation / Phase 2 - Backend Enhancement
**Status:** Complete

## Overview

This milestone refactors the Admin Dashboard from a simple tabbed page into a full enterprise dashboard with a fixed sidebar layout (matching the Staff Dashboard design), and adds cross-property Room and Reservation management with hotel-level filtering. The admin can now manage rooms, cancel reservations, and perform all staff-level operations from a single unified interface — scoped per hotel via dropdown selectors.

## Changes Made

### Backend

#### [MODIFY] [`AdminController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/AdminController.php)

Added `hotel_id` filtering to the `allReservations` method:

```diff
+// Filter by hotel
+if ($request->has('hotel_id')) {
+    $hotelId = $request->input('hotel_id');
+    $query->whereHas('room', function ($q) use ($hotelId) {
+        $q->where('hotel_id', $hotelId);
+    });
+}
```

This allows `GET /api/admin/reservations?hotel_id=1` to return only reservations for rooms belonging to hotel ID 1.

### Frontend

#### [MODIFY] [`app/admin/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/admin/page.tsx)

**Complete refactor** — 304 lines → ~550 lines. Major changes:

1. **Sidebar Layout** — Flexbox layout identical to the Staff Dashboard:
   - Fixed left sidebar (w-64, bg-slate-900, dark theme)
   - Scrollable right content area (bg-slate-50)
   - Logo, nav tabs, signed-in user info, role badge, logout button

2. **Six Sidebar Tabs:**
   - **Analytics** (default) — KPI cards, date filter, per-hotel performance table
   - **Manage Hotels** — Hotel cards with delete action
   - **Manage Rooms** — Hotel selector dropdown + room inventory table with inline editing
   - **Manage Reservations** — Hotel and status filter dropdowns + reservation table with cancel action
   - **Users** — Registered users list with role badges
   - **Contact Messages** — Contact form submissions with unread indicator

3. **Cross-Property Room Management:**
   - Hotel dropdown selector at the top ("Filter by Hotel")
   - When no hotel is selected: placeholder message ("Select a hotel above to manage its rooms")
   - When a hotel is selected: room inventory table loads with inline price/availability editing, enable/disable toggle, and **delete** button (admin-only action)
   - "Add New Room" form pre-bound to the selected hotel

4. **Cross-Property Reservation Management:**
   - Hotel dropdown selector ("Filter by Hotel") — defaults to "All Hotels"
   - Status dropdown selector ("Filter by Status") — defaults to "All Statuses"
   - Reservation table with guest name, hotel/room info, dates, total, status badge, and **cancel** action button
   - Cancellation confirmation modal (same pattern as Staff Dashboard)

## `hotel_id` State Management

The key design decision that prevents loading thousands of mixed-property records:

### Rooms Tab
```
roomHotelFilter state (string) → "" by default
  ├── When empty → No API call, renders "Select a hotel" placeholder
  └── When set   → GET /api/rooms?hotel_id={id}&per_page=50
                    Only rooms for that one hotel are fetched
```

The `fetchRooms()` function has an early return:
```typescript
if (!roomHotelFilter) {
  setRooms([]);
  return;
}
```

### Reservations Tab
```
resHotelFilter state (string) → "" by default
  ├── When empty → GET /api/admin/reservations?per_page=20 (paginated, safe)
  └── When set   → GET /api/admin/reservations?hotel_id={id}&per_page=20
```

Reservations default to "All Hotels" with pagination (20/page) since admins need a global view, but can drill down per hotel.

Both filters trigger re-fetches via dedicated `useEffect` hooks that watch their respective filter state variables, so changing the dropdown immediately updates the table without manual refresh.

## Visual Layout Comparison

| Element | Staff Dashboard | Admin Dashboard |
|---------|-----------------|-----------------|
| Layout | Sidebar + Content flex | ✅ Identical |
| Sidebar width | w-64 | ✅ w-64 |
| Sidebar bg | bg-slate-900 | ✅ bg-slate-900 |
| Active tab style | bg-amber-500 text-slate-950 | ✅ Identical |
| Content bg | bg-slate-50 | ✅ bg-slate-50 |
| Card style | rounded-2xl shadow-xl ring-1 | ✅ Identical |
| Table style | divide-y, muted headers | ✅ Identical |
| Role badge | N/A | Added "Administrator" badge |
| Room table | Inline edit price/available/toggle | ✅ Reused + added Delete |
| Cancel modal | Backdrop blur confirmation | ✅ Identical pattern |

## Files Modified

| File | Change |
|------|--------|
| [`AdminController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/AdminController.php) | Added `hotel_id` filter to `allReservations()` |
| [`app/admin/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/admin/page.tsx) | Full refactor: sidebar layout, 6 tabs, room/reservation management |

## API Endpoints Used

| Tab | Endpoint | Filters |
|-----|----------|---------|
| Analytics | `GET /admin/analytics` | `start_date`, `end_date` |
| Hotels | `GET /hotels` | `per_page=50` |
| Rooms | `GET /rooms` | `hotel_id`, `per_page=50` |
| Rooms (actions) | `PUT /rooms/{id}`, `DELETE /rooms/{id}`, `POST /rooms` | — |
| Reservations | `GET /admin/reservations` | `hotel_id`, `status`, `per_page=20` |
| Reservations (actions) | `POST /reservations/{id}/cancel` | — |
| Users | `GET /admin/users` | `per_page=50` |
| Contacts | `GET /admin/contact-messages` | `per_page=50` |

## Alignment with Master Document

- **Use Case Diagram (Figure 4):** Admin now has full property management capabilities across all hotels from a single interface
- **Functional Requirements (§2.1):** Rates & Availability management, Reservation management, Hotel administration, and Analytics dashboard all consolidated into the admin panel
- **System Architecture (Figure 2):** Frontend consumes existing RESTful APIs with minimal backend enhancement (only one new filter parameter added)
