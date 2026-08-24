"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import type { Hotel, Room, Review } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function HotelDetailPage() {
  const params = useParams<{ id: string }>();
  const hotelId = params.id;
  const { user } = useAuth();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showRooms, setShowRooms] = useState(false);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const minCheckoutDate = checkIn
    ? (() => {
        const d = new Date(checkIn + "T00:00:00");
        d.setDate(d.getDate() + 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })()
    : (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })();

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/hotels/${hotelId}`);
        const hotelData = response.data.hotel;
        setHotel(hotelData);
        setRooms(hotelData.rooms || []);
        setReviews(hotelData.reviews || []);
      } catch (error) {
        console.error("Failed to fetch hotel:", error);
      } finally {
        setLoading(false);
      }
    };
    if (hotelId) fetchHotel();
  }, [hotelId]);

  const handleAvailabilitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    try {
      const response = await api.get("/rooms", {
        params: {
          hotel_id: hotelId,
          check_in: checkIn,
          check_out: checkOut,
          per_page: 100,
        },
      });
      setRooms(response.data.data || []);
      setShowRooms(true);
    } catch (error) {
      console.error("Failed to fetch available rooms:", error);
      alert("Failed to check room availability. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="animate-pulse bg-card rounded-2xl shadow-xl h-96"></div>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full text-center">
        <h1 className="text-2xl font-bold text-foreground font-display">Hotel not found</h1>
        <Link href="/hotels" className="mt-4 inline-block text-primary hover:underline font-medium">
          ← Back to hotels
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full bg-background text-foreground">
      {/* Hotel Hero */}
      <div className="relative h-72 sm:h-96 w-full bg-gray-200">
        {hotel.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-3xl font-bold text-primary font-display">{hotel.chain}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              {hotel.chain}
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white font-display">{hotel.name}</h1>
            <p className="mt-1 text-gray-200">
              {hotel.city}, {hotel.country}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <h2 className="text-xl font-bold text-foreground font-display">About this hotel</h2>
              <p className="mt-4 text-foreground/80 leading-relaxed text-sm">{hotel.description}</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="flex">
                  {Array.from({ length: hotel.star_rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                  {Array.from({ length: 5 - hotel.star_rating }).map((_, i) => (
                    <Star key={i} className="size-4 text-muted/40" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{hotel.star_rating}-star hotel</span>
              </div>
            </section>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
                <h2 className="text-xl font-bold text-foreground font-display">Hotel Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full capitalize"
                    >
                      {amenity.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column - availability search */}
          <div className="space-y-6">
            <section className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <h2 className="text-xl font-bold text-foreground font-display">Check Availability</h2>
              <form onSubmit={handleAvailabilitySearch} className="mt-4 space-y-4">
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                    Check In
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="date"
                      value={checkIn}
                      min={todayStr}
                      onChange={(e) => {
                        const newCheckIn = e.target.value;
                        setCheckIn(newCheckIn);
                        if (checkOut) {
                          const ciDate = new Date(newCheckIn + "T00:00:00");
                          const coDate = new Date(checkOut + "T00:00:00");
                          if (ciDate >= coDate) {
                            const nextDay = new Date(ciDate);
                            nextDay.setDate(nextDay.getDate() + 1);
                            const nextDayStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
                            setCheckOut(nextDayStr);
                          }
                        }
                      }}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                    />
                  </div>
                </label>
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                    Check Out
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="date"
                      value={checkOut}
                      min={minCheckoutDate}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Show Available Rooms
                </button>
              </form>
            </section>

            {/* Reviews summary */}
            <section className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
              <h2 className="text-xl font-bold text-foreground font-display">Guest Reviews</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-3xl font-bold text-foreground font-display">
                      {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <div className="flex">
                      {Array.from({ length: Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) }).map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
                  </div>
                  <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-t border-border/60 pt-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            {review.user?.name || "Guest"}
                          </span>
                          <span className="text-amber-500 text-xs">{"★".repeat(review.rating)}</span>
                        </div>
                        {review.comment && (
                          <p className="mt-1 text-xs text-foreground/80">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-xs text-muted-foreground">No reviews yet.</p>
              )}
            </section>
          </div>
        </div>

        {/* Available Rooms */}
        {showRooms && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground font-display">Available Rooms</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const nights =
                  checkIn && checkOut
                    ? Math.max(1, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
                    : 1;
                const total = parseFloat(room.price_per_night) * nights;

                return (
                  <div key={room.id} className="overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-border/50 hover:shadow-2xl transition-all flex flex-col">
                    <div className="h-44 bg-gray-100 relative">
                      {room.image_url ? (
                        <img src={room.image_url} alt={room.room_type} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-primary font-semibold font-display text-sm">{room.room_type}</span>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Available
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-base">{room.room_type}</h3>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-lg font-bold text-primary">
                            {parseFloat(room.price_per_night).toLocaleString()} AED
                          </span>
                          <span className="text-xs text-muted-foreground">/ night</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Sleeps {room.capacity} · {room.total_rooms} rooms available
                        </p>
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {room.amenities.slice(0, 4).map((a) => (
                              <span key={a} className="bg-muted text-muted-foreground text-[0.7rem] px-2 py-0.5 rounded-md capitalize font-medium">
                                {a.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link
                        href={
                          user
                            ? `/book?room_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}`
                            : `/login?next=/book?room_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}`
                        }
                        className="mt-4 block w-full text-center py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 text-sm"
                      >
                        {total > parseFloat(room.price_per_night)
                          ? `Book · ${total.toLocaleString()} AED total`
                          : "Book Now"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}