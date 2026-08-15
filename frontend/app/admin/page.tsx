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
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <main className="flex-1 max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Manage hotels, view reservations, and monitor performance</p>

      {/* Tabs */}
      <div className="mt-6 flex space-x-2 border-b border-gray-200">
        {(["analytics", "reservations", "hotels"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="mt-8">
          {/* Date filter */}
          <form onSubmit={handleDateFilter} className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filter
            </button>
          </form>

          {/* KPI Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500">Room Nights</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.summary.room_nights}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500">Room Revenue</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {analytics.summary.room_revenue.toLocaleString()} AED
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500">Average Daily Rate</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {analytics.summary.average_daily_rate.toLocaleString()} AED
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{analytics.summary.total_reservations}</p>
            </div>
          </div>

          {/* Per-hotel breakdown */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900">Performance by Hotel</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hotel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Chain</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Room Nights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.by_hotel.map((hotel) => (
                    <tr key={hotel.hotel}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{hotel.hotel}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{hotel.chain}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{hotel.room_nights}</td>
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
        <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Reservations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Guest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hotel</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">#{reservation.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{reservation.user?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{reservation.room?.hotel?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(reservation.check_in_date).toLocaleDateString()} →{" "}
                      {new Date(reservation.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                      {parseFloat(reservation.total_price).toLocaleString()} AED
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[reservation.status]}`}>
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
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Manage Hotels</h2>
            <a
              href="/admin/hotels/new"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add Hotel
            </a>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  {hotel.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <span className="text-blue-500 font-semibold">{hotel.chain}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                  <p className="text-sm text-gray-500">{hotel.city}, {hotel.country}</p>
                  <div className="mt-3 flex space-x-2">
                    <a
                      href={`/admin/hotels/${hotel.id}/edit`}
                      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
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