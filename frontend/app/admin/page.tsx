"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AnalyticsData, PaginatedResponse, Reservation, Hotel } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "reservations" | "hotels">("analytics");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login?next=/admin");
      return;
    }
  }, [authLoading, user, router]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);

      const response = await api.get(`/admin/analytics?${params}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get<PaginatedResponse<Reservation>>("/admin/reservations?per_page=10");
      setReservations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await api.get<PaginatedResponse<Hotel>>("/hotels?per_page=50");
      setHotels(response.data.data);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      const loadAll = async () => {
        setLoading(true);
        await Promise.all([fetchAnalytics(), fetchReservations(), fetchHotels()]);
        setLoading(false);
      };
      loadAll();
    }
  }, [user]);

  const handleDateFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics();
  };

  const handleDeleteHotel = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this hotel? This will remove all its rooms and reservations.");
    if (!confirmed) return;

    try {
      await api.delete(`/hotels/${id}`);
      fetchHotels();
    } catch (error) {
      console.error("Failed to delete hotel:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage hotels, view reservations, and monitor performance</p>

      {/* Tabs */}
      <div className="mt-6 flex space-x-2 border-b border-border/60">
        {(["analytics", "reservations", "hotels"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="mt-8 space-y-6">
          {/* Date filter */}
          <form onSubmit={handleDateFilter} className="bg-card rounded-2xl shadow-xl p-4 ring-1 ring-border/50 flex flex-wrap gap-4 items-end">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Start Date</span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2 ring-1 ring-border">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">End Date</span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2 ring-1 ring-border">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer"
            >
              Apply Filter
            </button>
          </form>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Room Nights</p>
              <p className="mt-2 text-3xl font-bold text-foreground font-display">{analytics.summary.room_nights}</p>
            </div>
            <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Room Revenue</p>
              <p className="mt-2 text-3xl font-bold text-primary font-sans">
                {analytics.summary.room_revenue.toLocaleString()} <span className="text-sm font-sans font-medium text-muted-foreground">AED</span>
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Average Daily Rate</p>
              <p className="mt-2 text-3xl font-bold text-foreground font-sans">
                {analytics.summary.average_daily_rate.toLocaleString()} <span className="text-sm font-sans font-medium text-muted-foreground">AED</span>
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Reservations</p>
              <p className="mt-2 text-3xl font-bold text-foreground font-display">{analytics.summary.total_reservations}</p>
            </div>
          </div>

          {/* Per-hotel breakdown */}
          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 flex flex-col">
            <h2 className="text-xl font-bold text-foreground font-display mb-4">Performance by Hotel</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Hotel</th>
                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Chain</th>
                    <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Room Nights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {analytics.by_hotel.map((hotel) => (
                    <tr key={hotel.hotel}>
                      <td className="px-4 py-3 font-semibold text-foreground">{hotel.hotel}</td>
                      <td className="px-4 py-3 text-foreground/80">{hotel.chain}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground font-sans">{hotel.room_nights}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === "reservations" && (
        <div className="mt-8 bg-card rounded-2xl shadow-xl overflow-hidden ring-1 ring-border/50 flex flex-col">
          <div className="p-6 border-b border-border/60">
            <h2 className="text-xl font-bold text-foreground font-display">All Reservations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border/60">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">ID</th>
                  <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Guest</th>
                  <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Hotel</th>
                  <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Dates</th>
                  <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Total</th>
                  <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-4 py-3 text-foreground font-semibold">#{reservation.id}</td>
                    <td className="px-4 py-3 text-foreground/80">{reservation.user?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-foreground/80">{reservation.room?.hotel?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-foreground/80">
                      {new Date(reservation.check_in_date).toLocaleDateString()} →{" "}
                      {new Date(reservation.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-foreground font-sans">
                      {parseFloat(reservation.total_price).toLocaleString()} AED
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[reservation.status]}`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === "hotels" && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-foreground font-display">Manage Hotels</h2>
            <a
              href="/admin/hotels/new"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
            >
              + Add Hotel
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-border/50 hover:shadow-2xl transition-all flex flex-col">
                <div className="h-40 bg-gray-200 relative">
                  {hotel.image_url ? (
                    <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-primary font-semibold font-display text-sm">{hotel.chain}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-base font-display">{hotel.name}</h3>
                    <p className="text-xs text-muted-foreground">{hotel.city}, {hotel.country}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <a
                      href={`/admin/hotels/${hotel.id}/edit`}
                      className="px-3 py-1.5 text-xs font-semibold bg-muted text-muted-foreground rounded-md hover:opacity-95 transition-opacity"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}