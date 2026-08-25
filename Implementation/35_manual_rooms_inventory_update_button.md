# Milestone 35: Manual Rooms Inventory Update Button

**Date:** 25 August 2026
**Phase:** Phase 5 - Frontend UI Refinements
**Status:** Complete

## Overview

This milestone documents replacing the automatic on-blur update triggers with explicit "Update" buttons inside the Rooms Inventory management tables on both the Hotel Staff and System Admin Dashboards.

---

## 1. Modifications

### 1.1 UI State Additions
Declared a local dictionary state hook on both **[`frontend/app/staff/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/staff/page.tsx)** and **[`frontend/app/admin/page.tsx`](file:///d:/Book_My_Hotel/frontend/app/admin/page.tsx)**:
```typescript
const [editingRoomValues, setEditingRoomValues] = useState<Record<number, { price: number; available: number }>>({});
```

### 1.2 Table Input & Action Refactoring
*   **Controlled Input States:** Removed the `defaultValue` and auto-submit `onBlur` listeners on the price and availability inputs. Replaced them with controlled `value` pointers reading from `editingRoomValues` (falling back to stored database parameters if unedited) and `onChange` hooks updating the state buffer.
*   **Explicit Action Buttons:** Added a styled "Update" trigger button to the Action columns of the tables. Clicking the button executes `handleUpdateRoom()` using the updated buffered state values, dispatching the put query to `/api/rooms/{id}`.
