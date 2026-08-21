# Milestone 6: Stripe Payments Hardening & Promotional Discounts

**Date:** 21 August 2026
**Phase:** Phase 2 - Payment and Business Logic Fixes
**Status:** Complete

## Overview

This milestone hardens the payment processing architecture and implements promotional discounts during checkout inside the Laravel `/backend` environment. All changes were applied to [`ReservationController.php`](file:///d:/Book_My_Hotel/backend/app/Http/Controllers/ReservationController.php) to align with enterprise transaction guidelines and Stripe API specifications.

---

## 1. Stripe Refund Execution Fix

### The Problem
Previously, when canceling a booking in the `cancel()` method, the system attempted to cancel a reservation's associated payment by calling `$paymentIntent->cancel()` on a succeeded payment intent. According to the Stripe API specifications, once a `PaymentIntent` reaches the `succeeded` state, it cannot be cancelled; doing so throws a `Stripe\Exception\InvalidRequestException` runtime error. Succeeded payments must be reversed via Stripe's Refunds API.

### The Fix
The logic in the `cancel()` method was updated as follows:
1.  Verify if a payment record exists in the local database.
2.  If the local payment record status is already `'succeeded'`, invoke Stripe's Refund API using the fully qualified class name `\Stripe\Refund::create(['payment_intent' => $paymentIntentId])` and set the status in the database to `'refunded'`.
3.  If the payment is pending/unpaid, retrieve the `PaymentIntent` from Stripe. If its status is indeed not succeeded (e.g. `'requires_payment_method'`), call `$paymentIntent->cancel()` to void it, and mark the payment as `'cancelled'`.

### Code Implementation Snippet:
```php
// Refund via Stripe if payment was made
if ($reservation->payment) {
    try {
        $paymentIntentId = $reservation->payment->stripe_payment_intent_id;

        if ($reservation->payment->status === 'succeeded') {
            // Create refund for succeeded payments
            \Stripe\Refund::create(['payment_intent' => $paymentIntentId]);
            $reservation->payment->update(['status' => 'refunded']);
        } else {
            // Retrieve PaymentIntent to verify status
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            if ($paymentIntent->status !== 'succeeded') {
                $paymentIntent->cancel();
            }
            $reservation->payment->update(['status' => 'cancelled']);
        }
    } catch (\Exception $e) {
        // Log refund/cancellation failure but don't block cancellation
        \Log::error('Stripe refund/cancellation failed: '.$e->getMessage());
    }
}
```

---

## 2. Promotional Discount Logic Integration

### The Problem
Although promotions could be seeded and managed, the checkout process did not support discount application. The final booking price calculation and the subsequent Stripe `PaymentIntent` amount were hardcoded to the flat room rate times nights, ignoring any active promotional campaigns.

### The Fix
1.  **Validation Rule Update:** Added `promo_code` as a nullable, string field (max 50 characters) to the request validator in the `store()` method.
2.  **Promotion Lookup & Validation:** Added logic to query the `promotions` table for a record matching:
    *   The provided `promo_code` string.
    *   The specific `hotel_id` corresponding to the room being booked.
    *   Active status (`is_active = true`).
    *   Validity within the current date range (`start_date <= today <= end_date`).
3.  **Discount Calculation:** If a matching active promotion is found, calculate the discount amount (`discount = totalPrice * (discount_percentage / 100)`) and subtract it from the total price, bounded at 0: `totalPrice = max(0, totalPrice - discount)`.
4.  **Stripe Intent Sync:** The discounted total price is then used for both database reservation storage and Stripe `PaymentIntent` creation in cents: `(int) round($totalPrice * 100)`.

### Code Implementation Snippet:
```php
// Apply promo code if provided
if ($request->filled('promo_code')) {
    $today = Carbon::today()->toDateString();
    $promotion = \App\Models\Promotion::where('code', $request->input('promo_code'))
        ->where('hotel_id', $room->hotel_id)
        ->where('is_active', true)
        ->where('start_date', '<=', $today)
        ->where('end_date', '>=', $today)
        ->first();

    if ($promotion) {
        $discount = $totalPrice * ($promotion->discount_percentage / 100);
        $totalPrice = max(0, $totalPrice - $discount);
    }
}
```

---

## 3. Alignment with Functional Requirements

*   **Secure Payment & Refunds:** Aligns with standard PCI compliance and handles Stripe state rules gracefully.
*   **Promotions:** Implements the core business goal of allowing hotel managers to create active discount campaigns that reduce reservation pricing for customers during booking.
