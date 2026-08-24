# Milestone 13: Customer Promo Code Validation & Feedback

**Date:** 24 August 2026  
**Phase:** Phase 3 - Frontend Implementation / Phase 2 - Backend Integration  
**Status:** Complete  

## Overview

This milestone introduces precise error feedback to customers when applying discount promotion codes at checkout. Previously, if a entered promo code was invalid or expired, the system returned a generic error message ("Invalid or expired promo code for this hotel.") and did not display toast notifications. Now, it explicitly checks the promotion's status and date validity, triggering targeted `Toastify` notifications based on the failure reason.

## Key Changes

### 1. New Backend Validation Endpoint
- Added a new endpoint `GET /api/promotions/validate` routed to `PromotionController@validateCode` in [`routes/api.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/routes/api.php).
- Evaluates the query parameters `code` and `hotel_id` step-by-step:
  - If no promotion exists matching the code and hotel: returns status `invalid`.
  - If the promotion is not active: returns status `inactive`.
  - If the promotion hasn't started yet: returns status `not_started`.
  - If the promotion's end date has passed: returns status `expired`.
  - Otherwise: returns status `valid` alongside the promotion object.
- **Optimization Note**: All outcomes return an HTTP `200 OK` status to prevent red Axios/XMLHttpRequest errors in the browser console. The frontend parses the `status` field in the response payload to determine success or failure type.

### 2. Frontend Real-time Toastify Alerts
- Imported `toast` from `react-toastify` on the checkout/booking page [`app/book/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/book/page.tsx).
- Refactored `handleApplyPromo` to call the new `/api/promotions/validate` endpoint.
- Catches errors and displays exact lowercase toast alerts:
  - **Expired codes**: `toast.error("promo code expired")`
  - **Invalid codes**: `toast.error("invalid promo code")`
  - **Inactive/Pre-start codes**: Displays the custom backend error message.

## Files Modified

| File Path | Description |
|-----------|-------------|
| [`backend/routes/api.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/routes/api.php) | Registered public validation route `/promotions/validate`. |
| [`backend/app/Http/Controllers/PromotionController.php`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/backend/app/Http/Controllers/PromotionController.php) | Implemented the `validateCode` function. |
| [`frontend/app/book/page.tsx`](file:///d:/My%20docs/University/Semester%201/Enterprise%20Systems%20Development/BookMyHotel/frontend/app/book/page.tsx) | Integrated `react-toastify` feedback and refactored promo code validation handler. |

## Verification Plan

### Test Cases
- **Valid Code**: Applied code `SUMMER15` for Marriott. Output: Toast success "Promo code applied successfully!".
- **Expired Code**: Created a promo code ending yesterday. Applied on booking page. Output: Toast error "promo code expired".
- **Invalid Code**: Entered a non-existent code `XYZ999`. Applied on booking page. Output: Toast error "invalid promo code".
