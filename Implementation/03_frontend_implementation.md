# Milestone 3: Frontend Implementation (Next.js)

**Date:** 14 August 2026
**Phase:** Phase 3 - Frontend Implementation
**Status:** Complete

## Overview

This milestone implements the complete customer-facing frontend for BookMyHotel.com using Next.js 16 (React 19) with Tailwind CSS. The frontend acts strictly as the **Client** in the hybrid Client-Server architecture (Master §1.4), communicating with the Laravel backend exclusively via RESTful APIs. It never communicates directly with the database.

## Technology Stack

- **Framework:** Next.js 16.3.1 (App Router)
- **UI Library:** React 19.2.8
- **Styling:** Tailwind CSS v4 (mobile-responsive)
- **HTTP Client:** Axios 1.19
- **Payments:** Stripe.js + @stripe/react-stripe-js

## Application Structure

```
frontend/
├── app/
│   ├── page.tsx              # Home page with hero + search
│   ├── layout.tsx            # Root layout with AuthProvider
│   ├── hotels/
│   │   ├── page.tsx          # Hotel browsing with filters
│   │   └── [id]/page.tsx     # Hotel detail + room availability
│   ├── book/page.tsx         # Booking + Stripe checkout
│   ├── login/page.tsx        # User login
│   ├── register/page.tsx     # User registration
│   ├── reservations/page.tsx # Customer bookings management
│   ├── admin/page.tsx        # Admin dashboard + analytics
│   ├── staff/page.tsx        # Hotel staff dashboard
│   ├── promotions/page.tsx   # Deals & promotions browse
│   └── contact/page.tsx      # Contact form
├── components/
│   ├── Navbar.tsx            # Responsive navigation
│   └── Footer.tsx            # Site footer
├── lib/
│   ├── api.ts                # Axios client with auth interceptors
│   ├── auth-context.tsx      # Authentication state management
│   └── types.ts              # TypeScript interfaces
```

## Key Features Implemented

### 1. Authentication (AuthContext)
- Token-based auth via Laravel Sanctum
- Token + user stored in localStorage
- Axios request interceptor automatically attaches Bearer token
- Axios response interceptor handles 401 → redirect to login
- Context-based state management across all pages

### 2. Home Page
- Hero section with gradient background
- Search bar: city, check-in/check-out dates, guest count
- Partner hotel chain quick links
- Featured hotels carousel from API
- Current promotions/deals display

### 3. Hotel Browsing & Search
- Filter by hotel chain (Marriott, Hilton, Hyatt, Four Seasons)
- Filter by city
- Search by hotel name
- Pagination support
- Star rating display

### 4. Hotel Detail Page
- Hero image with overlay
- Hotel description and amenities
- Availability search with date selection
- Available rooms display with live price calculation
- Guest reviews summary with ratings

### 5. Booking & Payment (Stripe.js)
- Booking summary with nights calculation
- Guest count selection
- Special requests field
- **Stripe CardElement** for PCI-compliant card capture
- `confirmCardPayment()` with client secret from backend
- Automatic reservation confirmation on successful payment
- Test mode instructions (4224 4242 4242 4242 card)

### 6. Customer Reservations
- View all bookings with status badges
- Filter by status (pending, confirmed, cancelled, completed)
- Cancel confirmed bookings
- Complete payment for pending bookings
- Pagination

### 7. Admin Dashboard
- **KPI Cards:** Room Nights, Room Revenue, Average Daily Rate, Total Reservations
- Date range filter for analytics
- Per-hotel performance breakdown table
- All reservations view with guest/hotel/date/amount
- Hotel management (delete functionality)

### 8. Hotel Staff Dashboard
- **Room Management:** Add new rooms, inline price/availability editing, activate/deactivate
- **Reservations:** View daily reservations by date
- **Promotions:** Create discount offers with code, view active promotions

### 9. Contact Form
- Full-page contact form with validation
- Contact info display
- Success confirmation state

### 10. Promotions Page
- DISPLAYS ACTIVE promotion cards
- Discount percentage badge
- Hotel chain/location info
- Validity dates
- Promo code display
- CTA to book

## Mobile Responsiveness

- **Tailwind breakpoints:** mobile-first `sm:`, `md:`, `lg:` prefixes throughout
- **Responsive grid** layouts for hotels, cards
- **Mobile navigation** menu for small screens
- **Fluid typography** with `text-3xl sm:text-4xl lg:text-6xl`
- **Touch-friendly** buttons and inputs

## API Integration

```typescript
// Axios instance configured with API URL from env
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// All requests automatically include:
// - Authorization: Bearer <token> (via interceptor)
// - Content-Type: application/json
// - Accept: application/json
```

The Next.js config also includes rewrites to proxy `/api/*` to the Laravel backend at `localhost:8000`.

## Security Considerations

1. **Token Storage:** Auth tokens stored securely in localStorage, attached via Axios interceptor
2. **Stripe Elements:** Card data never touches our servers - handled entirely by Stripe.js
3. **Role-Based Routes:** Frontend guards admin/staff routes by user role
4. **Input Validation:** All forms collect validated data before sending to API
5. **No Sensitive Data in URL:** Booking IDs used in query params only (no payment data)

## Alignment with Master Document

- **System Architecture (Figure 2):** Next.js acts purely as the Client layer consuming RESTful APIs
- **Non-functional Requirement - Usability (§2.2):** Multiple search options (price via filters, services, rooms) implemented
- **Functional Requirement - Search (§2.1):** Search and filtering by price, services, and room type
- **Functional Requirement - Secure Payment (§2.1):** Stripe.js integrated in Test Mode
- **Use Case Diagram (Figure 4):** Customer interface (search, book, manage), Admin interface (analytics), Staff interface (room/rate updates)