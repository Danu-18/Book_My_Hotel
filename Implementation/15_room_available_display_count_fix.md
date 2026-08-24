# Milestone 15: Room Available Display Count Fix

**Date:** 25 August 2026  
**Phase:** Phase 3 - Frontend Implementation  
**Status:** Complete  

## Overview

This milestone fixes a frontend display issue where the hotel room selection grid displayed a fixed `10 rooms available` for every room type, regardless of the actual inventory count stored in the database.

## Bug Diagnosis

In the hotel details and room selection page [`app/hotels/[id]/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/hotels/[id]/page.tsx), the card template was rendering the room type's total physical capacity (`room.total_rooms`) rather than the active available inventory count (`room.available_rooms`):

```typescript
// app/hotels/[id]/page.tsx (line 294)
Sleeps {room.capacity} · {room.total_rooms} rooms available
```

Since the database seeder sets the base capacity `total_rooms` of every room configuration to `10` but configures different default available rooms (`available_rooms` ranging from 7 to 10), users were always seeing `10 rooms available` for all listings.

## Solution

We modified [`app/hotels/[id]/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/hotels/[id]/page.tsx) to map to the correct property:

```diff
-Sleeps {room.capacity} · {room.total_rooms} rooms available
+Sleeps {room.capacity} · {room.available_rooms} rooms available
```

This ensures that the listing cards dynamically display the correct count matching the database records (e.g. `9 rooms available` for Deluxe Rooms, `7 rooms available` for Royal Suites).

## Files Modified

| File Path | Description |
|-----------|-------------|
| [`app/hotels/[id]/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/hotels/[id]/page.tsx) | Updated the room detail description markup to display `available_rooms`. |

## Verification

- Navigated to the Hotel Details page.
- Checked the rooms listing grid.
- Verified that individual room types now show their respective available counts (e.g., standard room shows 10, Deluxe shows 9, Executive Suite shows 8, and Royal Suite shows 7) instead of a hardcoded 10.
