# Milestone 2: API Controllers & RESTful Routes

**Date:** 14 August 2026
**Phase:** Phase 2 - Backend Implementation (Laravel)
**Status:** Complete

## Overview

This milestone implements the complete RESTful API layer for BookMyHotel.com. Following the hybrid Client-Server + MVC architecture from Section 1.4 of the Master document, all business logic is contained within Laravel Controllers (the "C" in MVC), exposed via a strictly RESTful API consumed by the Next.js client. The API never serves views directly - it returns JSON only.

## Architecture

- **Server:** Laravel 12 (PHP 8.2+)
- **Auth:** Laravel Sanctum (token-based API authentication)
- **Payment:** Stripe SDK (Test Mode)
- **API Pattern:** RESTful Resource Controllers + Action Methods

## Controllers Created (8)

### 1. AuthController
| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| register | POST /api/register | Public | User registration with validation |
| login | POST /api/login | Public | Authentication & token issuance |
| logout | POST /api/logout | Auth | Invalidate current token |
| me | GET /api/me | Auth | Fetch current authenticated user |

**Security:** Passwords are hashed via Laravel's built-in `Hash::make()`, using Bcrypt with 12 rounds. Tokens are issued via Sanctum for stateless API authentication.

### 2. HotelController
| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| index | GET /api/hotels | Public | List hotels with chain/city/search filters |
| store | POST /api/hotels | Admin | Create a hotel |
| show | GET /api/hotels/{hotel} | Public | Hotel details with rooms & reviews |
| update | PUT /api/hotels/{hotel} | Admin | Update hotel details |
| destroy | DELETE /api/hotels/{hotel} | Admin | Remove a hotel |

### 3. RoomController
| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| index | GET /api/rooms | Public | Search rooms with price/type/capacity/date filters |
| store | POST /api/rooms | Staff/Admin | Create a room |
| show | GET /api/rooms/{room} | Public | Room details with bookings |
| update | PUT /api/rooms/{room} | Staff/Admin | Update room price/availability |
| destroy | DELETE /api/rooms/{room} | Admin | Remove a room |

**Key Feature:** The `index` method implements the **Search and filtering** functional requirement - customers can search and filter by price, services, room type, and date availability. It excludes rooms with confirmed reservations that overlap the requested dates.

### 4. ReservationController
| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| index | GET /api/reservations | Customer | List user's bookings |
| store | POST /api/reservations | Customer | Create booking + Stripe PaymentIntent |
| show | GET /api/reservations/{reservation} | Owner/Staff/Admin | View booking details |
| update | PUT /api/reservations/{reservation} | Customer | Update booking |
| cancel | POST /api/reservations/{reservation}/cancel | Owner/Admin | Cancel booking + Stripe refund |
| confirm | POST /api/reservations/{reservation}/confirm | Customer | Verify payment via Stripe & confirm |
| byDate | GET /api/staff/reservations/by-date | Staff | View bookings for a date |

**Stripe Integration:** When a reservation is created:
1. Total price is calculated: `price_per_night × nights`
2. Room date-conflict check prevents double-booking
3. Stripe PaymentIntent is created in Test Mode with `aed` currency
4. Payment record stored with the Stripe `payment_intent_id`
5. Client receives `client_secret` to complete card capture client-side

### 5. AdminController
| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| analytics | GET /api/admin/analytics | Admin | Dashboard KPIs |
| allReservations | GET /api/admin/reservations | Admin | All bookings with filters |
| users | GET /api/admin/users | Admin | User list with reservation counts |

**Analytics Dashboard Formula (per Master §2.1):**
- **Room nights** = sum of nights across confirmed reservations in date range
- **Room revenue** = total amount from succeeded payments
- **Average Daily Rate** = Room Revenue ÷ Room Nights

### 6. PromotionController
Manages discount actions created by hotel managers.

### 7. ReviewController
Handles guest reviews with rating and comment submission.

### 8. ContactController
Public contact form submission + admin review interface.

## Security & Authorization

- **Laravel Sanctum** for all authenticated routes (`auth:sanctum`)
- **Custom `CheckRole` middleware** enforces role-based access control:
  - `role:admin` - full system control
  - `role:staff` - room, rate & promotion management
  - Customer - own reservations only
- **Request validation** is applied on every write operation
- **Ownership checks** prevent users accessing other users' reservations
- **Stripe PaymentIntents** ensure card data is captured by Stripe, not the application

## Route Summary (36 routes)

All routes registered under the `api` prefix. Full listing confirmed via `php artisan route:list --path=api`.

## Alignment with Master Document

- **Functional Requirements (§2.1):** Registration/login, Search & filtering, Rates & Availability, Reservation management, Promotions, Guest reviews, Contact form, Secure payment, Hotel administration, Analytics dashboard - all covered
- **System Architecture (Figure 2):** Client-Server communication via RESTful API between Next.js and Laravel
- **DFD (Figure 6):** Processes (Search Rooms, Reservation, Payment, Hotel Data) map to controller methods
- **Non-functional requirements (§2.2):** Input validation, role-based auth, data integrity checks