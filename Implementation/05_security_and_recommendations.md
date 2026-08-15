# Milestone 5: Security Implications & Recommendations

**Date:** 14 August 2026
**Phase:** Phase 4 - Mandatory Documentation
**Status:** Complete

## Overview

This document details the security measures implemented in BookMyHotel.com, identifies potential vulnerabilities, and provides recommendations for production deployment - aligned with the security requirements of the Master document (§2.2 Security).

## Security Measures Implemented

### 1. Authentication & Authorization

| Measure | Implementation |
|---------|---------------|
| **Token-based API auth** | Laravel Sanctum personal access tokens |
| **Password hashing** | Bcrypt with 12 rounds |
| **Role-based access** | Custom `CheckRole` middleware (`role:admin`, `role:staff`) |
| **Ownership verification** | Users can only access their own reservations |
| **API token invalidation** | Logout endpoint deletes current token |

### 2. Payment Security

| Measure | Implementation |
|---------|---------------|
| **PCI compliance** | Card data handled entirely by Stripe.js - never touches our servers |
| **Payment Intent pattern** | Stripe PaymentIntents with client-side confirmation |
| **No card data storage** | Only `stripe_payment_intent_id` stored in database |
| **Test mode isolation** | Stripe Test Mode keys configured in `.env` |
| **Payment verification** | Backend verifies payment status via Stripe API before confirming |

### 3. Data Security

| Measure | Implementation |
|---------|---------------|
| **Input validation** | Laravel validation rules on all API endpoints |
| **SQL injection protection** | Eloquent ORM parameter binding |
| **XSS protection** | React/Next.js escapes user content by default |
| **CORS restrictions** | Only `localhost:3000` allowed as frontend origin |
| **CSRF exemption** | API routes use token auth (not session cookies) |

### 4. API Security

| Measure | Implementation |
|---------|---------------|
| **Rate limiting** | Laravel throttle middleware available for production |
| **HTTPS requirement** | Not enforced in local dev; required in production |
| **Error handling** | API returns structured JSON errors |
| **Sensitive data exclusion** | `password`, `remember_token` hidden from serialized User |

## Potential Vulnerabilities & Recommendations

### Production Deployment Recommendations

1. **HTTPS Everywhere**
   - Enforce HTTPS via TLS certificates
   - Set `APP_DEBUG=false` in production
   - Configure `STRIPE_WEBHOOK_SECRET` for webhook verification

2. **Rate Limiting**
   - Enable Laravel's `throttle` middleware on public routes
   - Prevent brute-force login attempts
   - Protect `/api/contact` from spam

3. **Database Security**
   - Use non-root database user with least-privilege
   - Strong database passwords
   - Regular encrypted backups
   - Enable MySQL SSL for remote connections

4. **Stripe Production**
   - Switch to production API keys
   - Implement Stripe webhooks for async payment events
   - Use `whsec_` webhook signing secret for payload verification
   - Handle 3D Secure authentication responses

5. **File Upload Security (Future)**
   - If hotel image uploads are implemented, validate file types
   - Store files outside web root or use cloud storage with signed URLs

6. **Environment Security**
   - Never commit `.env` files containing production secrets
   - Use environment-specific configuration
   - Rotate Stripe keys if exposed

7. **Session & Token Management**
   - Implement token expiration policy
   - Add token refresh mechanism
   - Consider using short-lived tokens with refresh rotation

## OWASP Top 10 Mapping

| OWASP Risk | BookMyHotel Mitigation |
|------------|----------------------|
| **A01: Broken Access Control** | ✅ Role middleware, ownership checks |
| **A02: Cryptographic Failures** | ✅ Bcrypt hashing, HTTPS-ready |
| **A03: Injection** | ✅ Eloquent ORM, Laravel validation |
| **A04: Insecure Design** | ✅ Server-side payment verification |
| **A05: Security Misconfiguration** | ⚠️ Production hardening needed |
| **A06: Vulnerable Components** | ✅ Composer/npm dependency auditing |
| **A07: Identification Failures** | ✅ Sanctum token auth |
| **A08: Software/Data Integrity** | ✅ Stripe server-side verification |
| **A09: Logging Failures** | ⚠️ Add comprehensive logging for production |
| **A10: SSRF** | ✅ Only internal Stripe API calls |

## Alignment with Module Assessment Criteria

The security implementation satisfies:

1. **LO2** - Critically analyse and synthesize technologies with security implications
2. **LO5** - Research and implement software elements to meet business/infrastructure needs securely
3. **Assessment criterion 1.8** - "Recommendation of improvements and security concerns"

## Conclusion

BookMyHotel.com implements robust security controls appropriate for an academic enterprise system project:
- Secure payment processing via Stripe Test Mode
- Role-based access control for three actor types
- Input validation and data integrity protections
- No sensitive card data stored in the database

The recommendations above outline the path to production-grade security, covering the additional controls expected for a live e-commerce platform handling real customer data and payments.