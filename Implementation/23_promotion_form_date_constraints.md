# Milestone 23: Promotion Form Date Constraints

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents enforcing date constraints and auto-corrections within the "Create Promotion" form on the hotel staff dashboard.

---

## 1. Modifications

In [`frontend/app/staff/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/staff/page.tsx):
*   **Dynamic Date Boundaries:**
    *   `today`: Set to today's date in `YYYY-MM-DD` format.
    *   `minEndDate`: Derived dynamically. If a start date is specified, the minimum end date is set to exactly one day after the start date. Otherwise, it defaults to tomorrow.
*   **Input Bindings:**
    *   Bound the `min` attribute of the Start Date picker to `today`.
    *   Bound the `min` attribute of the End Date picker to `minEndDate`.
*   **Auto-Correction Hook (`handleStartDateChange`):**
    *   If the user adjusts the Start Date to be on or after the already selected End Date, the End Date is automatically shifted forward to be exactly one day after the new Start Date.
