# Milestone 16: Dynamic Remaining Rooms Inventory Calculation

**Date:** 25 August 2026  
**Phase:** Phase 3 - Frontend Implementation / Phase 2 - Backend Integration  
**Status:** Complete  

## Overview

This milestone introduces the dynamic calculation and display of remaining rooms (`remaining_rooms`) for a requested date range. Previously, the room selection card showed the static capacity pool size (`available_rooms`), rather than accounting for overlapping reservations. Now, the backend dynamically calculates and injects the actual inventory headroom, and the frontend renders it in real-time.

## Key Changes

### 1. Backend Dynamic Attribute Injection

#### [MODIFY] [`RoomController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/RoomController.php)

Refactored the availability filter query to load the overlapping reservations count using Eloquent's `withCount` method when `check_in` and `check_out` parameters are supplied:

```php
$query->withCount(['reservations as overlapping_reservations_count' => function ($q) use ($checkIn, $checkOut) {
    $q->whereIn('status', ['confirmed', 'pending'])
      ->where('check_in_date', '<', $checkOut)
      ->where('check_out_date', '>', $checkIn);
}]);
```

After executing pagination, the collection is mapped to dynamically assign the calculated `remaining_rooms` attribute to the room models before response JSON conversion:

```php
if ($request->has('check_in') && $request->has('check_out')) {
    $rooms->through(function ($room) {
        $room->remaining_rooms = max(0, $room->available_rooms - $room->overlapping_reservations_count);
        return $room;
    });
}
```

### 2. Frontend Type Definitions

#### [MODIFY] [`types.ts`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/lib/types.ts)

Added the optional `remaining_rooms` property to the `Room` interface type block:

```typescript
export interface Room {
  // ...
  available_rooms: number;
  remaining_rooms?: number;
  // ...
}
```

### 3. Frontend Card rendering

#### [MODIFY] [`app/hotels/[id]/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/hotels/[id]/page.tsx)

Updated the room selection grid item to check for the presence of the dynamic `remaining_rooms` value, falling back gracefully to the total active inventory (`available_rooms`) if no check-in search has been executed:

```diff
-Sleeps {room.capacity} · {room.available_rooms} rooms available
+Sleeps {room.capacity} · {room.remaining_rooms !== undefined ? room.remaining_rooms : room.available_rooms} rooms available
```

## Files Modified

| File Path | Description |
|-----------|-------------|
| [`app/Http/Controllers/RoomController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/RoomController.php) | Appended `remaining_rooms` calculated field using `withCount`. |
| [`lib/types.ts`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/lib/types.ts) | Declared `remaining_rooms` in TypeScript `Room` structure. |
| [`app/hotels/[id]/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/hotels/[id]/page.tsx) | Implemented the dynamic rendering statement with ternary fallback checks. |

## Verification

### Query Verification
- Verified that the core overlap algorithm developed in Milestone 14 remains unchanged.
- Confirmed that the calculation computes:
  $$\text{remaining\_rooms} = \text{available\_rooms} - \text{booked\_count}$$
  where `booked_count` represents active (confirmed or pending) reservations overlapping the selection dates.
