"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { PaginatedResponse, Room, Reservation, Hotel, Promotion } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function StaffDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rooms" | "reservations" | "promotions">("rooms");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  // Room form state
  const [roomForm, setRoomForm] = useState({
    hotel_id: "",
    room_type: "",
    room_number: "",
    capacity: 2,
    price_per_night: "",
    total_rooms: 1,
    available_rooms: 1,
  });

  // Promotion form state
  const [promoForm, setPromoForm] = useState({
    hotel_id: "",
    title: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    code: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "staff")) {
      router.push("/login?next=/staff");
      return;
    }
  }, [authLoading, user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, hotelsRes, promosRes] = await Promise.all([
        api.get<PaginatedResponse<Room>>("/rooms?per_page=50"),
        api.get<PaginatedResponse<Hotel>>("/hotels?per_page=50"),
        api.get("/promotions"),
      ]);
      setRooms(roomsRes.data.data);
      setHotels(hotelsRes.data.data);
      setPromotions(promosRes.data.promotions || []);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationsByDate = async () => {
    try {
      const response = await api.get(`/staff/reservations/by-date?date=${filterDate}`);
      setReservations(response.data.reservations);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  useEffect(() => {
    if (user?.role === "staff") {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "reservations" && user?.role === "staff") {
      fetchReservationsByDate();
    }
  }, [activeTab, filterDate, user]);

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/rooms", {
        ...roomForm,
        hotel_id: Number(roomForm.hotel_id),
        capacity: Number(roomForm.capacity),
        price_per_night: Number(roomForm.price_per_night),
        total_rooms: Number(roomForm.total_rooms),
        available_rooms: Number(roomForm.available_rooms),
      });
      alert("Room added successfully!");
      setRoomForm({
        hotel_id: "",
        room_type: "",
        room_number: "",
        capacity: 2,
        price_per_night: "",
        total_rooms: 1,
        available_rooms: 1,
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add room:", error);
      alert("Failed to add room");
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/promotions", {
        ...promoForm,
        hotel_id: Number(promoForm.hotel_id),
        discount_percentage: Number(promoForm.discount_percentage),
      });
      alert("Promotion created successfully!");
      setPromoForm({
        hotel_id: "",
        title: "",
        description: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
        code: "",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to create promotion:", error);
      alert("Failed to create promotion");
    }
  };

  const handleUpdateRoom = async (id: number, price: number, available: number, active: boolean) => {
    try {
      await api.put(`/rooms/${id}`, {
        price_per_night: price,
        available_rooms: available,
        is_active: active,
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update room:", error);
      alert("Failed to update room");
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Hotel Staff Dashboard</h1>
      <p className="mt-2 text-gray-600">Update room availability, prices, and manage promotions</p>

      {/* Tabs */}
      <div className="mt-6 flex space-x-2 border-b border-gray-200">
        {(["rooms", "reservations", "promotions"] as const).map((tab) => (
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

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Room Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Room</h2>
            <form onSubmit={handleRoomSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Hotel</label>
                <select
                  value={roomForm.hotel_id}
                  onChange={(e) => setRoomForm({ ...roomForm, hotel_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select Hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room Type</label>
                <input
                  type="text"
                  value={roomForm.room_type}
                  onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                  required
                  placeholder="Deluxe Room"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room #</label>
                  <input
                    type="text"
                    value={roomForm.room_number}
                    onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Capacity</label>
                  <input
                    type="number"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                    min={1}
                    max={10}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Price/Night (AED)</label>
                  <input
                    type="number"
                    value={roomForm.price_per_night}
                    onChange={(e) => setRoomForm({ ...roomForm, price_per_night: e.target.value })}
                    min={0}
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Available</label>
                  <input
                    type="number"
                    value={roomForm.available_rooms}
                    onChange={(e) => setRoomForm({ ...roomForm, available_rooms: Number(e.target.value) })}
                    min={0}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Room
              </button>
            </form>
          </div>

          {/* Room List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Room Inventory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hotel</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Available</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{room.room_type}</div>
                        <div className="text-xs text-gray-500">#{room.room_number}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{room.hotel?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <input
                          type="number"
                          defaultValue={parseFloat(room.price_per_night)}
                          min={0}
                          step="0.01"
                          onBlur={(e) =>
                            handleUpdateRoom(room.id, Number(e.target.value), room.available_rooms, room.is_active)
                          }
                          className="w-24 px-2 py-1 text-right border border-gray-300 rounded text-sm"
                        />
                        <span className="ml-1 text-xs text-gray-500">AED</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <input
                          type="number"
                          defaultValue={room.available_rooms}
                          min={0}
                          onBlur={(e) =>
                            handleUpdateRoom(room.id, parseFloat(room.price_per_night), Number(e.target.value), room.is_active)
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            room.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleUpdateRoom(room.id, parseFloat(room.price_per_night), room.available_rooms, !room.is_active)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {room.is_active ? "Disable" : "Enable"}
                        </button>
                      </td>
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
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">View Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Reservations for {new Date(filterDate).toLocaleDateString()}
              </h2>
            </div>
            {reservations.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No reservations for this date</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Guest</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hotel</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Room</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{reservation.user?.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reservation.room?.hotel?.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reservation.room?.room_type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(reservation.check_in_date).toLocaleDateString()} →{" "}
                          {new Date(reservation.check_out_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                          {parseFloat(reservation.total_price).toLocaleString()} AED
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === "promotions" && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Promotion Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900">Create Promotion</h2>
            <form onSubmit={handlePromoSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Hotel</label>
                <select
                  value={promoForm.hotel_id}
                  onChange={(e) => setPromoForm({ ...promoForm, hotel_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select Hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  required
                  placeholder="Summer Special"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                <textarea
                  value={promoForm.description}
                  onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Discount %</label>
                <input
                  type="number"
                  value={promoForm.discount_percentage}
                  onChange={(e) => setPromoForm({ ...promoForm, discount_percentage: e.target.value })}
                  min={0}
                  max={100}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start</label>
                  <input
                    type="date"
                    value={promoForm.start_date}
                    onChange={(e) => setPromoForm({ ...promoForm, start_date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">End</label>
                  <input
                    type="date"
                    value={promoForm.end_date}
                    onChange={(e) => setPromoForm({ ...promoForm, end_date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Code</label>
                <input
                  type="text"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                  placeholder="SUMMER15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Promotion
              </button>
            </form>
          </div>

          {/* Promotions List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900">Active Promotions</h2>
            <div className="mt-4 space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                      <p className="text-sm text-gray-500">{promo.hotel?.name}</p>
                    </div>
                    <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{promo.discount_percentage}%
                    </span>
                  </div>
                  {promo.description && (
                    <p className="mt-2 text-sm text-gray-600">{promo.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(promo.start_date).toLocaleDateString()} →{" "}
                      {new Date(promo.end_date).toLocaleDateString()}
                    </span>
                    <span>
                      Code: <strong className="font-mono">{promo.code}</strong>
                    </span>
                  </div>
                </div>
              ))}
              {promotions.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500">
                  No active promotions
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}