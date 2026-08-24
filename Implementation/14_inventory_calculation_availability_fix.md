# Milestone 14: Room Availability & Inventory Query Fix

**Date:** 25 August 2026  
**Phase:** Phase 2 - Backend Bug Fix  
**Status:** Complete  

## Overview

This milestone fixes a critical inventory calculation bug in the room availability query. Previously, the system treated room types as single physical entities (blocking the entire room type from search results if a single reservation existed) rather than treating them as pools of inventory with multiple rooms.

## Bug Diagnosis

1. **Room Search**: In `RoomController@index`, the availability query used `whereNotIn` to exclude any room type ID that had at least one overlapping booking:
   ```php
   $bookedRoomIds = Reservation::where('status', 'confirmed')->...->pluck('room_id');
   $query->whereNotIn('id', $bookedRoomIds);
   ```
   If a hotel had 13 Standard Rooms, and 1 user booked a Standard Room, the Standard Room type would completely disappear from search results for everyone else.

2. **Booking Validation**: In `ReservationController@store`, the check used `exists()` on the same overlapping criteria, blocking a new reservation even if there were 12 standard rooms still vacant.

## Solution

We refactored the query logic in both controllers to dynamically calculate and compare booked counts against the available inventory pool:

### 1. Available Rooms Search Query

#### [MODIFY] [`RoomController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/RoomController.php)

Replaced `whereNotIn` with a subquery check comparing overlapping active bookings to `available_rooms`:

```php
$query->where(function ($q) use ($checkIn, $checkOut) {
    $q->whereRaw('available_rooms > (
        select count(*) from reservations 
        where reservations.room_id = rooms.id 
        and reservations.status in (\'confirmed\', \'pending\')
        and reservations.check_in_date < ?
        and reservations.check_out_date > ?
    )', [$checkOut, $checkIn]);
});
```

### 2. Booking Store Conflict Validation

#### [MODIFY] [`ReservationController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/ReservationController.php)

Replaced `.exists()` check with `.count()` comparison:

```php
$bookedCount = Reservation::where('room_id', $room->id)
    ->whereIn('status', ['confirmed', 'pending'])
    ->where('check_in_date', '<', $checkOut->toDateString())
    ->where('check_out_date', '>', $checkIn->toDateString())
    ->count();

if ($bookedCount >= $room->available_rooms) {
    return response()->json([
        'message' => 'This room is not available for the selected dates.',
        'errors' => ['room_id' => ['Room is already booked for the selected dates.']],
    ], 422);
}
```

- Calculates overlapping bookings where the reservation status is either `'confirmed'` or `'pending'` (ignoring `'cancelled'`).
- Permits users to see and reserve rooms of this type as long as `booked_count < available_rooms`.

## Files Modified

| File Path | Description |
|-----------|-------------|
| [`app/Http/Controllers/RoomController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/RoomController.php) | Updated the index search query check using raw SQL comparison. |
| [`app/Http/Controllers/ReservationController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/ReservationController.php) | Refactored conflict checking inside `store` to compare booking count with room inventory size. |

## Verification

### Query Comparison Verify
The updated query logic ensures:
- `booked_count` (the count of overlapping confirmed/pending reservations) is compared with `available_rooms` capacity.
- The room type remains visible and bookable as long as `booked_count < available_rooms`.
