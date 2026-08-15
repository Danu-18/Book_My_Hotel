"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { PaginatedResponse, Reservation } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function ReservationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?next=/reservations");
      return;
    }
  }, [authLoading, user, router]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (statusFilter) params.set("status", statusFilter);

      const response = await api.get<PaginatedResponse<Reservation>>(`/reservations?${params}`);
      setReservations(response.data.data);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReservations();
  }, [page, statusFilter, user]);

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to cancel this reservation?");
    if (!confirmed) return;

    try {
      await api.post(`/reservations/${id}/cancel`);
      fetchReservations();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800",
  };

  if (authLoading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Link
          href="/hotels"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Book New Stay
        </Link>
      </div>

      {/* Status filter */}
      <div className="mt-6 flex space-x-2 flex-wrap">
        {["", "pending", "confirmed", "cancelled", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-32"></div>
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No bookings found</h2>
          <p className="mt-2 text-gray-600">You haven't made any reservations yet.</p>
          <Link
            href="/hotels"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Hotels
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {reservation.room?.hotel?.name || `Reservation #${reservation.id}`}
                    </h2>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[reservation.status]}`}
                    >
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {reservation.room?.room_type} · {reservation.guests} guest{reservation.guests > 1 ? "s" : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>Check In:</strong>{" "}
                      {new Date(reservation.check_in_date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>Check Out:</strong>{" "}
                      {new Date(reservation.check_out_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {parseFloat(reservation.total_price).toLocaleString()} AED
                  </div>
                  {reservation.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {reservation.status === "pending" && (
                    <Link
                      href={`/book/pay?reservation_id=${reservation.id}`}
                      className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Complete Payment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {page} of {lastPage}
              </span>
              <button
                onClick={() => setPage(Math.min(lastPage, page + 1))}
                disabled={page === lastPage}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}