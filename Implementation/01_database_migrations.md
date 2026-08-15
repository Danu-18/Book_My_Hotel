# Milestone 1: Database Migrations & ER Diagram Implementation

**Date:** 14 August 2026
**Phase:** Phase 2 - Backend Implementation (Laravel)
**Status:** Complete

## Overview

This milestone implements the complete database schema for BookMyHotel.com, strictly following the Entity-Relationship (ER) diagram defined in the Master document (Figure 3). The schema consists of **8 tables** covering the 5 core entities plus additional supporting tables for functional requirements.

## Database Configuration

- **Database Engine:** MySQL
- **Connection:** `mysql` driver via PDO
- **Database Name:** `bookmyhotel`
- **Host:** `127.0.0.1:3306`
- **User:** `root`

## Tables Created

### 1. Users Table (`users`)
Based on the ER Diagram's `Users` entity. Expanded with role-based authentication fields to support the three actor types (Customer, Admin, Hotel Staff) identified in the Use Case Diagram (Figure 4).

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | Auto-increment |
| name | VARCHAR(255) | |
| email | VARCHAR(255) UNIQUE | Login identifier |
| email_verified_at | TIMESTAMP NULL | |
| password | VARCHAR(255) | Bcrypt hashed |
| role | ENUM(customer,staff,admin) | Default: customer |
| phone | VARCHAR(20) NULL | |
| timestamps | | |

### 2. Hotels (hotels)
Representing the `Hotel` entity from the ER diagram. The four hotel chains (Marriott, Hilton, Hyatt, Four Seasons) are stored with chain as a discriminator field.

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| name | VARCHAR(255) | Hotel name |
| chain | VARCHAR(255) | Marriott/Hilton/Hyatt/Four Seasons |
| location | VARCHAR(255) | Street/location |
| city | VARCHAR(255) | City |
| country | VARCHAR(255) | Country |
| description | TEXT NULL | Property page content |
| star_rating | INT | Default 5 |
| image_url | VARCHAR(255) NULL | |
| amenities | JSON NULL | Multiple services |
| latitude/longitude | DECIMAL(10,7) | Geolocation |

### 3. Rooms (Rooms)
One-to-many relationship with Hotels: each Hotel has multiple Rooms.

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| hotel_id | BIGINT FK → hotels.id | CASCADE delete |
| room_type | VARCHAR(100) | Standard/Deluxe/Suite |
| room_number | VARCHAR(50) UNIQUE | |
| capacity | INT | Max guests |
| price_per_night | DECIMAL(10,2) | Base rate |
| total_rooms | INT | Inventory count |
| available_rooms | INT | Current availability |
| amenities | JSON NULL | Room facilities |
| is_active | BOOLEAN | Soft disable |

### 4. Reservations (Reservations)
Core booking entity with FK relationships to both `Users` and `Rooms` per the ER diagram.

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| user_id | BIGINT FK | FK → users.id CASCADE |
| room_id | BIGINT FK | FK → rooms.id CASCADE |
| check_in_date | DATE | |
| check_out_date | DATE | |
| guests | INT | |
| total_price | DECIMAL(10,2) | Calculated |
| status | ENUM | pending/confirmed/cancelled/completed |
| special_requests | TEXT NULL | |

### 5. Payments (Payments)
One-to-one relationship with Reservations. Stores only the Stripe Payment Intent ID, never card data - directly implementing the requirement that "credit card details are handled by Stripe rather than stored directly."

| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| reservation_id | BIGINT FK | FK to reservations.id CASCADE |
| user_id | BIGINT FK | FK to users.id CASCADE |
| stripe_payment_intent_id | VARCHAR UNIQUE | Stripe reference |
| amount | DECIMAL(10,2) | |
| currency | CHAR(3) | Default AED |
| status | ENUM | pending/succeeded/failed/refunded |
| payment_method | VARCHAR NULL | Stripe method ID |

### 6. Promotions (Promotions)
Supports the "Promotions allow creating discount actions in addition to Rates & Availability" functional requirement.

### 7. Reviews (Reviews)
Implements "Guest Reviews aggregates scores of written guests feedback and ratings."

### 8. Contact Messages (Contact Messages)
No connection required to the specified ER diagram, but is essential for functionality for the "Contact form" requirement listed in 2.1.

## Relationships

| Relationship | Type | Implementation |
|---|---|---|
| Hotel → Rooms | One-to-Many | `hotels.id` → `rooms.hotel_id` |
| User → Reservations | One-to-Many | `users.id` → `reservations.user_id` |
| Room → Reservations | One-to-Many | `rooms.id` → `reservations.room_id` |
| Reservation → Payment | One-to-One | `reservations.id` → `payments.reservation_id` |

## Technical Decisions

1. **JSON columns** for `amenities` allow flexible facility definitions without schema changes, supporting future hotel additions.
2. **ENUM types** restrict status and role values to defined ranges, preserving data integrity.
3. **Cascade deletes** blind automated cleanup when a hotel/room/user is removed ensuring no consumed orphaned records.
4. **Decimal for prices** correctly provides accurate monetary values for the banking-integration and reports required by the Analytics Dashboard.

### Migration Files Created (11 total)
- `0001_01_01_000000_create_users_table.php` (Modified - added `role`, `phone`)
- `0001_01_01_000001_create_cache_table.php` (Laravel)
- `0001_01_01_000002_create_jobs_table.php` (Laravel)
- `2026_08_14_181906_create_personal_access_tokens_table.php` (Sanctum)
- `2026_08_14_182000_create_hotels_table.php`
- `2026_08_14_182100_create_rooms_table.php`
- `2026_08_14_182200_create_reservations_table.php`
- `2026_08_14_182300_create_payments_table.php`
- `2026_08_14_182400_create_promotions_table.php`
- `2026_08_14_182500_create_reviews_table.php`
- `2026_08_14_182600_create_contact_messages_table.php`

## Alignment with Master Document

1. **ER Diagram (Figure 3):** All core entities and relationships are faithfully implemented.
2. **Use Case Diagram (Figure 4):** `role` field supports the three actor types
3. **Functional Requirements (§2.1):** Rates & Availability, Reservation Management, Promotions, Reviews all represented
4. **Security (NFR §2.2):** Credit card data exclusion from DB, role-based access implementation
<task_progress>
- [x] Read and analyze Master.docx
- [x] Read and analyze SWE6013 Module Guide
- [x] Phase 1: Analyze existing monorepo structure
- [ ] Phase 2: Backend Implementation (Laravel)
  - [x] Configure .env for MySQL
  - [x] Install & configure Sanctum/Stripe
  - [x] Create migrations (Users, Hotels, Rooms, Reservations, Payments, Promotions, Reviews, Contact)
  - [x] Create Eloquent Models
  - [x] Create Controllers & API routes
  - [x] Run migrations & seed database
- [ ] Phase 3: Frontend Implementation (Next.js)
- [ ] Phase 4: Mandatory Documentation
</task_progress>
</write_to_file>