# Milestone 6: Stripe Sandbox Key Configuration

**Date:** 20 August 2026
**Phase:** Phase 2 - Backend Configuration / Phase 3 - Frontend Configuration
**Status:** Complete

## Overview

This milestone replaces the generic placeholder Stripe test keys with real Stripe Sandbox (Test Mode) API keys, enabling functional payment testing through the Stripe test environment. Previously, the application used non-functional dummy keys (`pk_test_TYooMQauvdEDq54NiTphI7jx` / `sk_test_TYooMQauvdEDq54NiTphI7jx`) that would fail on actual PaymentIntent creation. The new sandbox keys are tied to a real Stripe test-mode account, allowing end-to-end payment flow testing.

## Changes Made

### 1. Backend (`backend/.env`)

| Key | Old Value | New Value |
|-----|-----------|-----------|
| `STRIPE_KEY` | `pk_test_TYooMQauvdEDq54NiTphI7jx` | `pk_test_51U4Vk9ATraUhHfYi7znKk...` (Stripe Sandbox Publishable Key) |
| `STRIPE_SECRET` | `sk_test_TYooMQauvdEDq54NiTphI7jx` | `sk_test_51U4Vk9ATraUhHfYifsD37o...` (Stripe Sandbox Secret Key) |

The `STRIPE_SECRET` is used server-side by the Laravel backend (via the Stripe PHP SDK) to:
- Create PaymentIntents when a reservation is made (`ReservationController@store`)
- Verify payment status when confirming a reservation (`ReservationController@confirm`)
- Process refunds when a reservation is cancelled (`ReservationController@cancel`)

### 2. Frontend (`frontend/.env.local`)

| Key | Old Value | New Value |
|-----|-----------|-----------|
| `NEXT_PUBLIC_STRIPE_KEY` | `pk_test_TYooMQauvdEDq54NiTphI7jx` | `pk_test_51U4Vk9ATraUhHfYi7znKk...` (Stripe Sandbox Publishable Key) |

The `NEXT_PUBLIC_STRIPE_KEY` is used client-side by the Next.js frontend (via `@stripe/stripe-js`) to:
- Initialise the Stripe.js library (`loadStripe()`)
- Render the `CardElement` for secure PCI-compliant card capture
- Confirm card payments via `stripe.confirmCardPayment(clientSecret)`

## Files Modified

| File | Change |
|------|--------|
| [`backend/.env`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/.env) | Updated `STRIPE_KEY` and `STRIPE_SECRET` |
| [`frontend/.env.local`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/.env.local) | Updated `NEXT_PUBLIC_STRIPE_KEY` |

## Payment Flow (Unchanged)

The Stripe integration flow remains identical — only the API keys changed:

```
1. Customer selects room & dates → clicks "Book Now"
2. Frontend sends POST /api/reservations → Laravel creates PaymentIntent (STRIPE_SECRET)
3. Laravel returns { client_secret } to frontend
4. Frontend uses Stripe.js (NEXT_PUBLIC_STRIPE_KEY) + CardElement to capture card
5. Frontend calls stripe.confirmCardPayment(client_secret)
6. On success, frontend calls POST /api/reservations/{id}/confirm
7. Laravel verifies PaymentIntent status via Stripe API → marks reservation confirmed
```

## Testing

With the new sandbox keys, the following test card can be used:

| Field | Value |
|-------|-------|
| **Card Number** | `4242 4242 4242 4242` |
| **Expiry** | Any future date (e.g., 12/34) |
| **CVC** | Any 3-digit number (e.g., 123) |
| **ZIP** | Any 5-digit number (e.g., 42424) |

> **Note:** Both development servers (backend on port 8000, frontend on port 3000) must be restarted after this change for the new environment variables to take effect.

## Security Note

These are **Stripe Test Mode (Sandbox)** keys — they can only process test transactions and cannot charge real cards. For production deployment, these must be replaced with live Stripe keys (`pk_live_...` / `sk_live_...`) and additional security measures should be implemented (see [05_security_and_recommendations.md](./05_security_and_recommendations.md)).

## Alignment with Master Document

- **Functional Requirement - Secure Payment (§2.1):** Stripe integration now uses functional sandbox keys, enabling verifiable end-to-end payment testing
- **Non-functional Requirement - Security (§2.2):** Credit card data continues to be handled entirely by Stripe.js — no card data touches the application servers
