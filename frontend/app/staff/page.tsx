"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { PaginatedResponse, Room, Reservation, Promotion } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";

export default function StaffDashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rooms" | "reservations" | "promotions">("rooms");
  const [filterDate, setFilterDate] = useState("");

  // Room form state
  const [roomForm, setRoomForm] = useState({
    room_type: "",
    room_number: "",
    capacity: 2,
    price_per_night: "",
    total_rooms: 1,
    available_rooms: 1,
  });

  // Promotion form state
  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    code: "",
  });

  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  // Dynamic date calculations for promotions
  const today = new Date().toISOString().split("T")[0];

  let minEndDate = "";
  if (promoForm.start_date) {
    const nextDay = new Date(promoForm.start_date);
    nextDay.setDate(nextDay.getDate() + 1);
    minEndDate = nextDay.toISOString().split("T")[0];
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    minEndDate = tomorrow.toISOString().split("T")[0];
  }

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "staff")) {
      router.push("/login?next=/staff");
      return;
    }
  }, [authLoading, user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, promosRes] = await Promise.all([
        api.get<PaginatedResponse<Room>>("/rooms?per_page=50"),
        api.get("/promotions"),
      ]);
      setRooms(roomsRes.data.data);
      setPromotions(promosRes.data.promotions || []);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationsByDate = async () => {
    try {
      if (!filterDate) {
        const response = await api.get("/reservations?per_page=100");
        setReservations(response.data.data || []);
      } else {
        const response = await api.get(`/staff/reservations/by-date?date=${filterDate}`);
        setReservations(response.data.reservations || []);
      }
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
        hotel_id: Number(user?.hotel_id),
        capacity: Number(roomForm.capacity),
        price_per_night: Number(roomForm.price_per_night),
        total_rooms: Number(roomForm.total_rooms),
        available_rooms: Number(roomForm.available_rooms),
      });
      toast.success("Room added successfully!");
      setRoomForm({
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
      toast.error("Failed to add room");
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromoId !== null) {
        await api.put(`/promotions/${editingPromoId}`, {
          ...promoForm,
          hotel_id: Number(user?.hotel_id),
          discount_percentage: Number(promoForm.discount_percentage),
        });
        toast.success("Promotion updated successfully!");
        setEditingPromoId(null);
      } else {
        await api.post("/promotions", {
          ...promoForm,
          hotel_id: Number(user?.hotel_id),
          discount_percentage: Number(promoForm.discount_percentage),
        });
        toast.success("Promotion created successfully!");
      }
      setPromoForm({
        title: "",
        description: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
        code: "",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to save promotion:", error);
      toast.error("Failed to save promotion");
    }
  };

  const handleStartDateChange = (val: string) => {
    let updatedEnd = promoForm.end_date;
    if (val) {
      const selectedStart = new Date(val);
      const nextDay = new Date(selectedStart);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split("T")[0];

      if (promoForm.end_date && new Date(promoForm.end_date) <= selectedStart) {
        updatedEnd = nextDayStr;
      }
    }
    setPromoForm({ ...promoForm, start_date: val, end_date: updatedEnd });
  };

  const handleCancelReservation = (id: number) => {
    setReservationToCancel(id);
  };

  const executeCancelReservation = async (id: number) => {
    try {
      await api.post(`/reservations/${id}/cancel`);
      toast.success("Reservation cancelled and payment refunded successfully!");
      fetchReservationsByDate();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      toast.error("Failed to cancel reservation");
    }
  };

  const handleEditPromo = (promo: Promotion) => {
    setEditingPromoId(promo.id);
    setPromoForm({
      title: promo.title,
      description: promo.description || "",
      discount_percentage: String(promo.discount_percentage),
      start_date: promo.start_date,
      end_date: promo.end_date,
      code: promo.code,
    });
  };

  const handleDeletePromo = (id: number) => {
    setPromoToDelete(id);
  };

  const executeDeletePromo = async (id: number) => {
    try {
      await api.delete(`/promotions/${id}`);
      toast.success("Promotion deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      toast.error("Failed to delete promotion");
    }
  };

  const handleUpdateRoom = async (id: number, price: number, available: number, active: boolean) => {
    try {
      await api.put(`/rooms/${id}`, {
        price_per_night: price,
        available_rooms: available,
        is_active: active,
      });
      toast.success("Room inventory updated!");
      fetchData();
    } catch (error) {
      console.error("Failed to update room:", error);
      toast.error("Failed to update room");
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
    <div className="flex min-h-screen bg-slate-50 w-full text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              BookMyHotel<span className="text-slate-400 font-sans font-normal text-sm">.com</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            {/* Tabs */}
            <nav className="space-y-1">
              {(["rooms", "reservations", "promotions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === tab
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer & Logout */}
        <div className="space-y-4 border-t border-slate-800 pt-6">
          <div className="px-3">
            <p className="text-xs text-slate-400 font-medium">Signed in as:</p>
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 text-red-400 font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-red-300 transition-colors cursor-pointer text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto flex flex-col bg-slate-50">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-display">Hotel Staff Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Update room availability, prices, and manage promotions</p>
        </header>

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Room Form */}
          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 self-start space-y-6">
            <h2 className="text-xl font-bold text-foreground font-display">Add New Room</h2>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
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
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
            <div className="p-6 border-b border-border/60 flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-bold text-foreground font-display">
                {filterDate ? `Reservations for ${new Date(filterDate + "T00:00:00").toLocaleDateString()}` : "All Reservations"}
              </h2>
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  Clear Date Filter
                </button>
              )}
            </div>
            {reservations.length === 0 ? (
              <div className="p-10 text-center text-xs text-muted-foreground">
                {filterDate ? "No reservations for this date" : "No reservations found"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/60">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Guest</th>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Room</th>
                      <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Dates</th>
                      <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                      <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Total</th>
                      <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-sm">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-4 py-3 font-semibold text-foreground">{reservation.user?.name}</td>
                        <td className="px-4 py-3 text-foreground/80">{reservation.room?.room_type}</td>
                        <td className="px-4 py-3 text-foreground/80">
                          {new Date(reservation.check_in_date).toLocaleDateString()} →{" "}
                          {new Date(reservation.check_out_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                              reservation.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : reservation.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : reservation.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-primary font-sans">
                          {parseFloat(reservation.total_price).toLocaleString()} AED
                        </td>
                        <td className="px-4 py-3 text-center">
                          {reservation.status !== "cancelled" ? (
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
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
            <h2 className="text-xl font-bold text-foreground font-display">
              {editingPromoId !== null ? "Edit Promotion" : "Create Promotion"}
            </h2>
            <form onSubmit={handlePromoSubmit} className="space-y-4">
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
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      min={today}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                      min={minEndDate}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
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
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground uppercase font-semibold"
                  />
                </div>
              </label>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer"
                >
                  {editingPromoId !== null ? "Update" : "Create"} Promotion
                </button>
                {editingPromoId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPromoId(null);
                      setPromoForm({
                        title: "",
                        description: "",
                        discount_percentage: "",
                        start_date: "",
                        end_date: "",
                        code: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
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
                    <div className="flex items-center gap-3">
                      <span>
                        Code: <strong className="font-mono text-primary">{promo.code}</strong>
                      </span>
                      <span className="text-muted-foreground/30">|</span>
                      <button
                        onClick={() => handleEditPromo(promo)}
                        className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
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

      {/* Cancellation Confirmation Modal */}
      {reservationToCancel !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-6 max-w-md w-full mx-4 space-y-4 text-left">
            <h3 className="text-lg font-bold text-foreground font-display">Cancel Reservation?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to cancel this reservation? The Stripe payment will be refunded.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReservationToCancel(null)}
                className="px-4 py-2 bg-muted text-muted-foreground hover:bg-border font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                No, Keep Booking
              </button>
              <button
                onClick={() => {
                  const id = reservationToCancel;
                  setReservationToCancel(null);
                  executeCancelReservation(id);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:opacity-90 font-semibold rounded-lg text-sm transition-opacity cursor-pointer shadow-md"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Delete Confirmation Modal */}
      {promoToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-6 max-w-md w-full mx-4 space-y-4 text-left">
            <h3 className="text-lg font-bold text-foreground font-display">Delete Promotion?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete this promotion? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPromoToDelete(null)}
                className="px-4 py-2 bg-muted text-muted-foreground hover:bg-border font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const id = promoToDelete;
                  setPromoToDelete(null);
                  executeDeletePromo(id);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:opacity-90 font-semibold rounded-lg text-sm transition-opacity cursor-pointer shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}