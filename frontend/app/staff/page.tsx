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
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Hotel Staff Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Update room availability, prices, and manage promotions</p>

      {/* Tabs */}
      <div className="mt-6 flex space-x-2 border-b border-border/60">
        {(["rooms", "reservations", "promotions"] as const).map((tab) => (
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

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Room Form */}
          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 self-start space-y-6">
            <h2 className="text-xl font-bold text-foreground font-display">Add New Room</h2>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Hotel
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <select
                    value={roomForm.hotel_id}
                    onChange={(e) => setRoomForm({ ...roomForm, hotel_id: e.target.value })}
                    required
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Room Type
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <input
                    type="text"
                    value={roomForm.room_type}
                    onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                    required
                    placeholder="Deluxe Room"
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    Room #
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="text"
                      value={roomForm.room_number}
                      onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    Capacity
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="number"
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                      min={1}
                      max={10}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    Price/Night (AED)
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="number"
                      value={roomForm.price_per_night}
                      onChange={(e) => setRoomForm({ ...roomForm, price_per_night: e.target.value })}
                      min={0}
                      step="0.01"
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    Available
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="number"
                      value={roomForm.available_rooms}
                      onChange={(e) => setRoomForm({ ...roomForm, available_rooms: Number(e.target.value) })}
                      min={0}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer"
              >
                Add Room
              </button>
            </form>
          </div>

          {/* Room List */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-xl overflow-hidden ring-1 ring-border/50 flex flex-col self-start">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-xl font-bold text-foreground font-display">Room Inventory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Room</th>
                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Hotel</th>
                    <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Price</th>
                    <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Available</th>
                    <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{room.room_type}</div>
                        <div className="text-xs text-muted-foreground">#{room.room_number}</div>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">{room.hotel?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
                          <input
                            type="number"
                            defaultValue={parseFloat(room.price_per_night)}
                            min={0}
                            step="0.01"
                            onBlur={(e) =>
                              handleUpdateRoom(room.id, Number(e.target.value), room.available_rooms, room.is_active)
                            }
                            className="w-16 text-right bg-transparent outline-none text-foreground"
                          />
                          <span className="text-[0.7rem] text-muted-foreground font-semibold">AED</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex bg-background px-2 py-1 rounded-md border border-border">
                          <input
                            type="number"
                            defaultValue={room.available_rooms}
                            min={0}
                            onBlur={(e) =>
                              handleUpdateRoom(room.id, parseFloat(room.price_per_night), Number(e.target.value), room.is_active)
                            }
                            className="w-10 text-center bg-transparent outline-none text-foreground"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            room.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleUpdateRoom(room.id, parseFloat(room.price_per_night), room.available_rooms, !room.is_active)}
                          className="text-xs text-primary hover:underline font-semibold cursor-pointer"
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
        <div className="mt-8 space-y-6">
          <div className="bg-card rounded-2xl shadow-xl p-4 ring-1 ring-border/50 flex flex-wrap items-end gap-4">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                View Date
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2 ring-1 ring-border">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>
          </div>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden ring-1 ring-border/50">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-xl font-bold text-foreground font-display">
                Reservations for {new Date(filterDate).toLocaleDateString()}
              </h2>
            </div>
            {reservations.length === 0 ? (
              <div className="p-10 text-center text-xs text-muted-foreground">No reservations for this date</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/60">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Guest</th>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Hotel</th>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Room</th>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Dates</th>
                      <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-sm">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-4 py-3 font-semibold text-foreground">{reservation.user?.name}</td>
                        <td className="px-4 py-3 text-foreground/80">{reservation.room?.hotel?.name}</td>
                        <td className="px-4 py-3 text-foreground/80">{reservation.room?.room_type}</td>
                        <td className="px-4 py-3 text-foreground/80">
                          {new Date(reservation.check_in_date).toLocaleDateString()} →{" "}
                          {new Date(reservation.check_out_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary font-sans">
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
          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 self-start space-y-6">
            <h2 className="text-xl font-bold text-foreground font-display">Create Promotion</h2>
            <form onSubmit={handlePromoSubmit} className="space-y-4">
              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Hotel
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <select
                    value={promoForm.hotel_id}
                    onChange={(e) => setPromoForm({ ...promoForm, hotel_id: e.target.value })}
                    required
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Title
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <input
                    type="text"
                    value={promoForm.title}
                    onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                    required
                    placeholder="Summer Special"
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                  />
                </div>
              </label>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Description
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <textarea
                    value={promoForm.description}
                    onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                    rows={2}
                    placeholder="Describe discount details..."
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                  />
                </div>
              </label>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Discount Percentage
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <input
                    type="number"
                    value={promoForm.discount_percentage}
                    onChange={(e) => setPromoForm({ ...promoForm, discount_percentage: e.target.value })}
                    min={0}
                    max={100}
                    required
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    Start
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="date"
                      value={promoForm.start_date}
                      onChange={(e) => setPromoForm({ ...promoForm, start_date: e.target.value })}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    End
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="date"
                      value={promoForm.end_date}
                      onChange={(e) => setPromoForm({ ...promoForm, end_date: e.target.value })}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
              </div>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Code
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <input
                    type="text"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                    placeholder="SUMMER15"
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground uppercase font-semibold"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer"
              >
                Create Promotion
              </button>
            </form>
          </div>

          {/* Promotions List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground font-display">Active Promotions</h2>
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-base font-display">{promo.title}</h3>
                      <p className="text-xs text-muted-foreground">{promo.hotel?.name}</p>
                    </div>
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shrink-0">
                      -{promo.discount_percentage}%
                    </span>
                  </div>
                  {promo.description && (
                    <p className="mt-2 text-xs text-foreground/80">{promo.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                    <span>
                      {new Date(promo.start_date).toLocaleDateString()} →{" "}
                      {new Date(promo.end_date).toLocaleDateString()}
                    </span>
                    <span>
                      Code: <strong className="font-mono text-primary">{promo.code}</strong>
                    </span>
                  </div>
                </div>
              ))}
              {promotions.length === 0 && (
                <div className="bg-card rounded-2xl p-10 text-center text-xs text-muted-foreground shadow-xl ring-1 ring-border/50">
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