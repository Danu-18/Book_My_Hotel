"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  const handleAvailabilitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRooms(true);
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="animate-pulse bg-white rounded-lg shadow h-96"></div>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900">Hotel not found</h1>
        <Link href="/hotels" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
          ← Back to hotels
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full">
      {/* Hotel Hero */}
      <div className="relative h-72 sm:h-96 w-full bg-gray-200">
        {hotel.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <span className="text-3xl font-bold text-blue-500">{hotel.chain}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
              {hotel.chain}
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">{hotel.name}</h1>
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
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900">About this hotel</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">{hotel.description}</p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-amber-500">
                  {"★".repeat(hotel.star_rating)}
                  <span className="text-gray-300">{"★".repeat(5 - hotel.star_rating)}</span>
                </span>
                <span className="text-sm text-gray-500">{hotel.star_rating}-star hotel</span>
              </div>
            </section>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900">Hotel Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full capitalize"
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
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900">Check Availability</h2>
              <form onSubmit={handleAvailabilitySearch} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Show Available Rooms
                </button>
              </form>
            </section>

            {/* Reviews summary */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900">Guest Reviews</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <span className="text-amber-500">
                      {"★".repeat(Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length))}
                    </span>
                    <span className="text-sm text-gray-500">{reviews.length} reviews</span>
                  </div>
                  <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-t border-gray-100 pt-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-800">
                            {review.user?.name || "Guest"}
                          </span>
                          <span className="text-amber-500 text-sm">{"★".repeat(review.rating)}</span>
                        </div>
                        {review.comment && (
                          <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No reviews yet.</p>
              )}
            </section>
          </div>
        </div>

        {/* Available Rooms */}
        {showRooms && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const nights =
                  checkIn && checkOut
                    ? Math.max(1, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
                    : 1;
                const total = parseFloat(room.price_per_night) * nights;

                return (
                  <div key={room.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-100 relative">
                      {room.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={room.image_url} alt={room.room_type} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50">
                          <span className="text-blue-600 font-semibold">{room.room_type}</span>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Available
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{room.room_type}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {parseFloat(room.price_per_night).toLocaleString()} AED
                        </span>
                        <span className="text-xs text-gray-500">/ night</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Sleeps {room.capacity} · {room.total_rooms} rooms available
                      </p>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {room.amenities.slice(0, 4).map((a) => (
                            <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">
                              {a.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link
                        href={
                          user
                            ? `/book?room_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}`
                            : `/login?next=/book?room_id=${room.id}&check_in=${checkIn}&check_out=${checkOut}`
                        }
                        className="mt-4 block w-full text-center py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
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