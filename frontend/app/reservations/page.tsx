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
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground font-display">My Bookings</h1>
        <Link
          href="/hotels"
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
        >
          Book New Stay
        </Link>
      </div>

      {/* Status filter */}
      <div className="mt-6 flex space-x-2 flex-wrap gap-y-2">
        {["", "pending", "confirmed", "cancelled", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl shadow animate-pulse h-32"></div>
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-card rounded-2xl shadow-xl ring-1 ring-border/50">
          <h2 className="text-xl font-bold text-foreground font-display">No bookings found</h2>
          <p className="mt-2 text-sm text-muted-foreground">You haven't made any reservations yet.</p>
          <Link
            href="/hotels"
            className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
          >
            Browse Hotels
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                    <h2 className="text-lg font-bold text-foreground font-display">
                      {reservation.room?.hotel?.name || `Reservation #${reservation.id}`}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[reservation.status]}`}
                    >
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {reservation.room?.room_type} · {reservation.guests} guest{reservation.guests > 1 ? "s" : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/80">
                    <span>
                      <strong className="text-foreground">Check In:</strong>{" "}
                      {new Date(reservation.check_in_date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong className="text-foreground">Check Out:</strong>{" "}
                      {new Date(reservation.check_out_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="sm:mt-0 text-left sm:text-right flex-shrink-0">
                  <div className="text-xl font-bold text-primary font-sans">
                    {parseFloat(reservation.total_price).toLocaleString()} AED
                  </div>
                  <div className="mt-1 flex items-center justify-start sm:justify-end gap-2 text-xs">
                    {reservation.status === "confirmed" && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="text-destructive hover:underline font-semibold cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {reservation.status === "pending" && (
                      <Link
                        href={`/book/pay?reservation_id=${reservation.id}`}
                        className="text-primary hover:underline font-semibold"
                      >
                        Complete Payment
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-xs text-muted-foreground font-semibold">
                Page {page} of {lastPage}
              </span>
              <button
                onClick={() => setPage(Math.min(lastPage, page + 1))}
                disabled={page === lastPage}
                className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
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