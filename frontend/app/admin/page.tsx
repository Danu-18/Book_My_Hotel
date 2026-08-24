"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type {
  AnalyticsData,
  PaginatedResponse,
  Reservation,
  Hotel,
  Room,
  User,
  Promotion,
} from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";

type AdminTab = "analytics" | "hotels" | "rooms" | "reservations" | "promotions" | "users" | "contacts";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  // Shared state
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resHotelFilter, setResHotelFilter] = useState<string>("");
  const [resStatusFilter, setResStatusFilter] = useState<string>("");
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  // Rooms state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomHotelFilter, setRoomHotelFilter] = useState<string>("");
  const [roomForm, setRoomForm] = useState({
    hotel_id: "",
    room_type: "",
    room_number: "",
    capacity: 2,
    price_per_night: "",
    total_rooms: 1,
    available_rooms: 1,
  });

  // Users state
  const [users, setUsers] = useState<User[]>([]);

  // Contact messages state
  const [contacts, setContacts] = useState<Array<{
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }>>([]);

  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoHotelFilter, setPromoHotelFilter] = useState<string>("");
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);
  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    code: "",
  });

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

  // ─── Auth guard ───
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login?next=/admin");
    }
  }, [authLoading, user, router]);

  // ─── Initial data load ───
  useEffect(() => {
    if (user?.role === "admin") {
      const load = async () => {
        setLoading(true);
        await Promise.all([fetchAnalytics(), fetchHotels()]);
        setLoading(false);
      };
      load();
    }
  }, [user]);

  // ─── Tab-specific data loaders ───
  useEffect(() => {
    if (user?.role !== "admin") return;
    if (activeTab === "reservations") fetchReservations();
    if (activeTab === "rooms") fetchRooms();
    if (activeTab === "promotions") fetchPromotions();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "contacts") fetchContacts();
  }, [activeTab, user]);

  // ─── Re-fetch when hotel/status filters change ───
  useEffect(() => {
    if (activeTab === "reservations" && user?.role === "admin") fetchReservations();
  }, [resHotelFilter, resStatusFilter]);

  useEffect(() => {
    if (activeTab === "rooms" && user?.role === "admin") fetchRooms();
  }, [roomHotelFilter]);

  useEffect(() => {
    if (activeTab === "promotions" && user?.role === "admin") fetchPromotions();
  }, [promoHotelFilter]);

  // ─── API fetch functions ───
  const fetchHotels = async () => {
    try {
      const res = await api.get<PaginatedResponse<Hotel>>("/hotels?per_page=50");
      setHotels(res.data.data);
    } catch (e) {
      console.error("Failed to fetch hotels:", e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      const res = await api.get(`/admin/analytics?${params}`);
      setAnalytics(res.data);
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    }
  };

  const fetchReservations = async () => {
    try {
      const params = new URLSearchParams({ per_page: "20" });
      if (resHotelFilter) params.set("hotel_id", resHotelFilter);
      if (resStatusFilter) params.set("status", resStatusFilter);
      const res = await api.get<PaginatedResponse<Reservation>>(`/admin/reservations?${params}`);
      setReservations(res.data.data);
    } catch (e) {
      console.error("Failed to fetch reservations:", e);
    }
  };

  const fetchRooms = async () => {
    if (!roomHotelFilter) {
      setRooms([]);
      return;
    }
    try {
      const res = await api.get<PaginatedResponse<Room>>(`/rooms?hotel_id=${roomHotelFilter}&per_page=50`);
      setRooms(res.data.data);
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get<PaginatedResponse<User>>("/admin/users?per_page=50");
      setUsers(res.data.data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get("/admin/contact-messages?per_page=50");
      setContacts(res.data.data || []);
    } catch (e) {
      console.error("Failed to fetch contacts:", e);
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      let promos: Promotion[] = res.data.promotions || res.data.data || [];
      if (promoHotelFilter) {
        promos = promos.filter((p) => String(p.hotel_id) === promoHotelFilter);
      }
      setPromotions(promos);
    } catch (e) {
      console.error("Failed to fetch promotions:", e);
    }
  };

  // ─── Action handlers ───
  const handleDateFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics();
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hotelId = Number(promoHotelFilter);
    if (!hotelId) {
      toast.error("Please select a hotel first");
      return;
    }
    try {
      if (editingPromoId !== null) {
        await api.put(`/promotions/${editingPromoId}`, {
          ...promoForm,
          hotel_id: hotelId,
          discount_percentage: Number(promoForm.discount_percentage),
        });
        toast.success("Promotion updated successfully!");
        setEditingPromoId(null);
      } else {
        await api.post("/promotions", {
          ...promoForm,
          hotel_id: hotelId,
          discount_percentage: Number(promoForm.discount_percentage),
        });
        toast.success("Promotion created successfully!");
      }
      setPromoForm({ title: "", description: "", discount_percentage: "", start_date: "", end_date: "", code: "" });
      fetchPromotions();
    } catch (e) {
      console.error("Failed to save promotion:", e);
      toast.error("Failed to save promotion");
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

  const executeDeletePromo = async (id: number) => {
    try {
      await api.delete(`/promotions/${id}`);
      toast.success("Promotion deleted successfully!");
      fetchPromotions();
    } catch (e) {
      console.error("Failed to delete promotion:", e);
      toast.error("Failed to delete promotion");
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

  const handleDeleteHotel = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hotel? All rooms and reservations will be removed.")) return;
    try {
      await api.delete(`/hotels/${id}`);
      toast.success("Hotel deleted successfully!");
      fetchHotels();
    } catch (e) {
      console.error("Failed to delete hotel:", e);
      toast.error("Failed to delete hotel");
    }
  };

  const handleUpdateRoom = async (id: number, price: number, available: number, active: boolean) => {
    try {
      await api.put(`/rooms/${id}`, {
        price_per_night: price,
        available_rooms: available,
        is_active: active,
      });
      toast.success("Room updated!");
      fetchRooms();
    } catch (e) {
      console.error("Failed to update room:", e);
      toast.error("Failed to update room");
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted successfully!");
      fetchRooms();
    } catch (e) {
      console.error("Failed to delete room:", e);
      toast.error("Failed to delete room");
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/rooms", {
        hotel_id: Number(roomForm.hotel_id || roomHotelFilter),
        room_type: roomForm.room_type,
        room_number: roomForm.room_number,
        capacity: Number(roomForm.capacity),
        price_per_night: Number(roomForm.price_per_night),
        total_rooms: Number(roomForm.total_rooms),
        available_rooms: Number(roomForm.available_rooms),
      });
      toast.success("Room added successfully!");
      setRoomForm({
        hotel_id: "",
        room_type: "",
        room_number: "",
        capacity: 2,
        price_per_night: "",
        total_rooms: 1,
        available_rooms: 1,
      });
      fetchRooms();
    } catch (e) {
      console.error("Failed to add room:", e);
      toast.error("Failed to add room");
    }
  };

  const executeCancelReservation = async (id: number) => {
    try {
      await api.post(`/reservations/${id}/cancel`);
      toast.success("Reservation cancelled and payment refunded!");
      fetchReservations();
    } catch (e) {
      console.error("Failed to cancel reservation:", e);
      toast.error("Failed to cancel reservation");
    }
  };

  // ─── Loading state ───
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

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "analytics", label: "Analytics" },
    { key: "hotels", label: "Manage Hotels" },
    { key: "rooms", label: "Manage Rooms" },
    { key: "reservations", label: "Manage Reservations" },
    { key: "promotions", label: "Manage Promotions" },
    { key: "users", label: "Users" },
    { key: "contacts", label: "Contact Messages" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background w-full text-foreground">
      {/* Mobile Top Header */}
      <div className="flex md:hidden items-center justify-between px-6 py-4 bg-card border-b border-border/60 sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            BookMyHotel<span className="text-muted-foreground font-sans font-normal text-xs">.com</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize tracking-wider">
            {activeTab}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card flex flex-col justify-between p-6 shrink-0 border-r border-border/60 transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              BookMyHotel<span className="text-muted-foreground font-sans font-normal text-sm">.com</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[0.65rem] font-bold text-muted-foreground uppercase tracking-wider">
              Administration
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer & Logout */}
        <div className="space-y-4 border-t border-border/60 pt-6">
          <div className="px-3">
            <p className="text-xs text-muted-foreground font-medium">Signed in as:</p>
            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-primary font-semibold mt-0.5">Administrator</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-muted text-destructive hover:bg-destructive/10 font-semibold rounded-lg border border-border/40 transition-colors cursor-pointer text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col bg-background">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display">Admin Dashboard</h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Manage hotels, rooms, reservations, and monitor performance across all properties
          </p>
        </header>

        {/* ═══════════════════════════════════════════════════ */}
        {/* ANALYTICS TAB                                       */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-6">
            {/* Date filter */}
            <form onSubmit={handleDateFilter} className="bg-card rounded-2xl shadow-xl p-4 ring-1 ring-border/50 flex flex-wrap gap-4 items-end">
              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Start Date</span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2 ring-1 ring-border">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold" />
                </div>
              </label>
              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">End Date</span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2 ring-1 ring-border">
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold" />
                </div>
              </label>
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer">
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

        {/* ═══════════════════════════════════════════════════ */}
        {/* MANAGE HOTELS TAB                                   */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "hotels" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-foreground font-display">Manage Hotels</h2>
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
                      <p className="text-xs text-muted-foreground mt-1">⭐ {hotel.star_rating} Stars • {hotel.rooms_count ?? hotel.rooms?.length ?? "—"} rooms</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
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

        {/* ═══════════════════════════════════════════════════ */}
        {/* MANAGE ROOMS TAB                                    */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            {/* Hotel selector */}
            <div className="bg-card rounded-2xl shadow-xl p-4 ring-1 ring-border/50 flex flex-wrap items-end gap-4">
              <label className="block min-w-[260px]">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Filter by Hotel
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <select
                    value={roomHotelFilter}
                    onChange={(e) => setRoomHotelFilter(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold cursor-pointer"
                  >
                    <option value="">— Select a hotel —</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={String(h.id)}>
                        {h.name} ({h.chain})
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            {!roomHotelFilter ? (
              <div className="bg-card rounded-2xl p-16 text-center text-sm text-muted-foreground shadow-xl ring-1 ring-border/50">
                Select a hotel above to manage its rooms
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Room Form */}
                <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 self-start space-y-6">
                  <h2 className="text-xl font-bold text-foreground font-display">Add New Room</h2>
                  <form onSubmit={handleRoomSubmit} className="space-y-4">
                    <label className="block min-w-0">
                      <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Room Type</span>
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
                        <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Room #</span>
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
                        <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Capacity</span>
                        <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                          <input
                            type="number"
                            value={roomForm.capacity}
                            onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                            min={1} max={10} required
                            className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                          />
                        </div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block min-w-0">
                        <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Price/Night (AED)</span>
                        <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                          <input
                            type="number"
                            value={roomForm.price_per_night}
                            onChange={(e) => setRoomForm({ ...roomForm, price_per_night: e.target.value })}
                            min={0} step="0.01" required
                            className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                          />
                        </div>
                      </label>
                      <label className="block min-w-0">
                        <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Available</span>
                        <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                          <input
                            type="number"
                            value={roomForm.available_rooms}
                            onChange={(e) => setRoomForm({ ...roomForm, available_rooms: Number(e.target.value) })}
                            min={0} required
                            className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                          />
                        </div>
                      </label>
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer">
                      Add Room
                    </button>
                  </form>
                </div>

                {/* Room Inventory Table */}
                <div className="lg:col-span-2 bg-card rounded-2xl shadow-xl overflow-hidden ring-1 ring-border/50 flex flex-col self-start">
                  <div className="p-6 border-b border-border/60">
                    <h2 className="text-xl font-bold text-foreground font-display">
                      Room Inventory — {hotels.find((h) => String(h.id) === roomHotelFilter)?.name}
                    </h2>
                  </div>
                  {rooms.length === 0 ? (
                    <div className="p-10 text-center text-xs text-muted-foreground">No rooms found for this hotel</div>
                  ) : (
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
                                    min={0} step="0.01"
                                    onBlur={(e) => handleUpdateRoom(room.id, Number(e.target.value), room.available_rooms, room.is_active)}
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
                                    onBlur={(e) => handleUpdateRoom(room.id, parseFloat(room.price_per_night), Number(e.target.value), room.is_active)}
                                    className="w-10 text-center bg-transparent outline-none text-foreground"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${room.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                  {room.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center space-x-2">
                                <button
                                  onClick={() => handleUpdateRoom(room.id, parseFloat(room.price_per_night), room.available_rooms, !room.is_active)}
                                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                                >
                                  {room.is_active ? "Disable" : "Enable"}
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                                >
                                  Delete
                                </button>
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
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* MANAGE RESERVATIONS TAB                             */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            {/* Filters row */}
            <div className="bg-card rounded-2xl shadow-xl p-4 ring-1 ring-border/50 flex flex-wrap items-end gap-4">
              <label className="block min-w-[260px]">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Filter by Hotel
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <select
                    value={resHotelFilter}
                    onChange={(e) => setResHotelFilter(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold cursor-pointer"
                  >
                    <option value="">All Hotels</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={String(h.id)}>
                        {h.name} ({h.chain})
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="block min-w-[180px]">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Filter by Status
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <select
                    value={resStatusFilter}
                    onChange={(e) => setResStatusFilter(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </label>
            </div>

            {/* Reservations table */}
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden ring-1 ring-border/50 flex flex-col">
              <div className="p-6 border-b border-border/60 flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-bold text-foreground font-display">
                  {resHotelFilter
                    ? `Reservations — ${hotels.find((h) => String(h.id) === resHotelFilter)?.name}`
                    : "All Reservations"}
                </h2>
                <span className="text-xs text-muted-foreground font-semibold">
                  {reservations.length} result{reservations.length !== 1 ? "s" : ""}
                </span>
              </div>
              {reservations.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground">No reservations found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border/60">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">ID</th>
                        <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Guest</th>
                        <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Hotel / Room</th>
                        <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Dates</th>
                        <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Total</th>
                        <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                        <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-sm">
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-4 py-3 text-foreground font-semibold">#{reservation.id}</td>
                          <td className="px-4 py-3 text-foreground/80">{reservation.user?.name || "N/A"}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground text-xs">{reservation.room?.hotel?.name || "N/A"}</div>
                            <div className="text-xs text-muted-foreground">{reservation.room?.room_type}</div>
                          </td>
                          <td className="px-4 py-3 text-foreground/80">
                            {new Date(reservation.check_in_date).toLocaleDateString()} →{" "}
                            {new Date(reservation.check_out_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-foreground font-sans">
                            {parseFloat(reservation.total_price).toLocaleString()} AED
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColors[reservation.status]}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {reservation.status !== "cancelled" ? (
                              <button
                                onClick={() => setReservationToCancel(reservation.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
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

        {/* ═══════════════════════════════════════════════════ */}
        {/* MANAGE PROMOTIONS TAB                               */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "promotions" && (
          <div className="space-y-6">
            {/* Hotel selector */}
            <div className="bg-card rounded-2xl shadow-xl p-4 ring-1 ring-border/50 flex flex-wrap items-end gap-4">
              <label className="block min-w-[260px]">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Filter by Hotel
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <select
                    value={promoHotelFilter}
                    onChange={(e) => setPromoHotelFilter(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold cursor-pointer"
                  >
                    <option value="">— Select a hotel —</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={String(h.id)}>
                        {h.name} ({h.chain})
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            {!promoHotelFilter ? (
              <div className="bg-card rounded-2xl p-16 text-center text-sm text-muted-foreground shadow-xl ring-1 ring-border/50">
                Select a hotel above to manage its promotions
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create / Edit Promotion Form */}
                <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 self-start space-y-6">
                  <h2 className="text-xl font-bold text-foreground font-display">
                    {editingPromoId !== null ? "Edit Promotion" : "Create Promotion"}
                  </h2>
                  <form onSubmit={handlePromoSubmit} className="space-y-4">
                    <label className="block min-w-0">
                      <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Title</span>
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
                      <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Description</span>
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
                      <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Discount Percentage</span>
                      <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                        <input
                          type="number"
                          value={promoForm.discount_percentage}
                          onChange={(e) => setPromoForm({ ...promoForm, discount_percentage: e.target.value })}
                          min={0} max={100} required
                          className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                        />
                      </div>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="block min-w-0">
                        <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Start</span>
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
                        <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">End</span>
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
                      <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">Promo Code</span>
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
                            setPromoForm({ title: "", description: "", discount_percentage: "", start_date: "", end_date: "", code: "" });
                          }}
                          className="px-4 py-3 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-border transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Promotions List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">
                    Promotions — {hotels.find((h) => String(h.id) === promoHotelFilter)?.name}
                  </h2>
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
                              onClick={() => setPromoToDelete(promo.id)}
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
                        No promotions for this hotel
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* USERS TAB                                           */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div className="bg-card rounded-2xl shadow-xl overflow-hidden ring-1 ring-border/50 flex flex-col">
            <div className="p-6 border-b border-border/60">
              <h2 className="text-xl font-bold text-foreground font-display">Registered Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Name</th>
                    <th className="px-4 py-3.5 text-left text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Email</th>
                    <th className="px-4 py-3.5 text-center text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Role</th>
                    <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-semibold text-foreground">{u.name}</td>
                      <td className="px-4 py-3 text-foreground/80">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                          u.role === "admin" ? "bg-purple-100 text-purple-800" : u.role === "staff" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground/80">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* CONTACT MESSAGES TAB                                */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground font-display">Contact Messages</h2>
            {contacts.length === 0 ? (
              <div className="bg-card rounded-2xl p-10 text-center text-xs text-muted-foreground shadow-xl ring-1 ring-border/50">
                No contact messages
              </div>
            ) : (
              contacts.map((msg) => (
                <div key={msg.id} className={`bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 ${!msg.is_read ? "border-l-4 border-l-primary" : ""}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-base font-display">{msg.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{msg.name} • {msg.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── Cancellation Confirmation Modal ─── */}
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

        {/* ─── Promotion Delete Confirmation Modal ─── */}
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