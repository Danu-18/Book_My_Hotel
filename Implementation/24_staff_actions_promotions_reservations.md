# Milestone 24: Staff Actions for Reservations and Promotions

**Date:** 24 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents adding "Edit" and "Cancel/Delete" action triggers to both the Reservations and Promotions list tabs on the hotel staff dashboard.

---

## 1. Modifications

In [`frontend/app/staff/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/staff/page.tsx):

### 1.1 Reservations Actions
*   **Actions Column:** Added an "Actions" header column to the table.
*   **Cancel Booking Button:** Styled as destructive red text, visible only when the reservation status is not `cancelled`.
*   **Axios Request Integration:** Invokes a `POST /reservations/{id}/cancel` request.
*   **Stripe Refund Preservation:** Bypasses no Stripe workflows by routing through the existing backend controller `cancel` method, which automatically retrieves Stripe credentials and issues a refund:
    ```typescript
    const handleCancelReservation = async (id: number) => {
      if (!window.confirm("Are you sure you want to cancel this reservation? The Stripe payment will be refunded.")) {
        return;
      }
      try {
        await api.post(`/reservations/${id}/cancel`);
        toast.success("Reservation cancelled and payment refunded successfully!");
        fetchReservationsByDate();
      } catch (error) {
        console.error("Failed to cancel reservation:", error);
        toast.error("Failed to cancel reservation");
      }
    };
    ```

### 1.2 Promotions Actions
*   **Form Mode Transition (`editingPromoId` state):** Added an editing pointer to toggle the promotion form header from `"Create Promotion"` to `"Edit Promotion"`, change the submit button to `"Update Promotion"`, and offer a `"Cancel"` edit button to reset fields.
*   **Axios PUT Update Integration:**
    ```typescript
    if (editingPromoId !== null) {
      await api.put(`/promotions/${editingPromoId}`, {
        ...promoForm,
        hotel_id: Number(user?.hotel_id),
        discount_percentage: Number(promoForm.discount_percentage),
      });
      toast.success("Promotion updated successfully!");
      setEditingPromoId(null);
    }
    ```
*   **Axios DELETE Removal Integration:** Added a "Delete" button invoking `DELETE /promotions/{id}`:
    ```typescript
    const handleDeletePromo = async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this promotion?")) {
        return;
      }
      try {
        await api.delete(`/promotions/${id}`);
        toast.success("Promotion deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete promotion:", error);
        toast.error("Failed to delete promotion");
      }
    };
    ```
