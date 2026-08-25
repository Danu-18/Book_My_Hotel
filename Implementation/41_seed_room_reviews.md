# Milestone 41: Seed Dummy Reviews on Rooms

**Date:** 25 August 2026
**Phase:** Phase 6 - Production Readiness
**Status:** Complete

## Overview

This milestone documents adding a `room_id` nullable column to the reviews database table, updating the backend models and controllers to save/associate reviews with specific rooms, and seeding multiple dummy reviews associated with specific hotel rooms.

---

## 1. Database & Model Schema Extension

### 1.1 Migration Update
In [`2026_08_14_182500_create_reviews_table.php`](file:///d:/Book_My_Hotel/backend/database/migrations/2026_08_14_182500_create_reviews_table.php):
Added the `room_id` foreign key:
```php
$table->foreignId('room_id')->nullable()->constrained()->onDelete('set null');
```

### 1.2 Model Relation Integration
In [`Review.php`](file:///d:/Book_My_Hotel/backend/app/Models/Review.php):
Added `room_id` to `$fillable` array and defined the `room` relationship:
```php
public function room(): BelongsTo
{
    return $this->belongsTo(Room::class);
}
```

### 1.3 Controller Persistence
In [`ReviewController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReviewController.php):
Included the `room_id` parameter inside the `Review::create([...])` block when a customer submits a new review.

---

## 2. Seeded Room Reviews

In [`DatabaseSeeder.php`](file:///d:/Book_My_Hotel/backend/database/seeders/DatabaseSeeder.php):
Seeded **6 room-specific reviews** across all 4 hotel chains (Marriott, Hilton, Hyatt, and Four Seasons) to provide realistic test evaluation data.
