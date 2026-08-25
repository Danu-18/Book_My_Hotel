# Milestone 40: Seeder Refactoring for Academic Evaluation

**Date:** 25 August 2026
**Phase:** Phase 6 - Production Readiness
**Status:** Complete

## Overview

This milestone documents rewriting the database seeder to establish a heavy set of realistic evaluation records for grading the BookMyHotel platform.

---

## 1. Seeded Records

### 1.1 Multi-Tenant Hotels
Strictly created exactly **4 hotels**:
1.  Marriott Downtown Dubai
2.  Hilton Corniche Abu Dhabi
3.  Hyatt Regency Istanbul
4.  Four Seasons London

### 1.2 User Roles
*   **System Admin:** 1 account (`admin@bookmyhotel.com`)
*   **Hotel Managers:** 4 hotel staff accounts (one per hotel) + 1 legacy account (`staff@bookmyhotel.com`)
*   **Customers:** 6 newly structured evaluation customers (`customer1@test.com` to `customer6@test.com`) + 1 legacy customer (`customer@bookmyhotel.com`)

### 1.3 Inventory & Promos
*   **Rooms:** 5 distinct categories per hotel (20 total rooms) ranging from Standard to Royal Suite.
*   **Promotions:** 6 active discount codes.
*   **Ancillary Services:** 6 category items seeded per hotel (24 total).

### 1.4 Transactions & Feedback
*   **Reservations:** Exactly 6 bookings covering all states:
    *   2x `completed` (dates in the past)
    *   2x `confirmed` (dates in the future)
    *   1x `pending` (dates in the future)
    *   1x `cancelled` (dates in the past)
*   **Payments:** Attached Visa test cards to all confirmed and completed bookings.
*   **Reviews:** 2 high-quality reviews linked to the completed bookings.
