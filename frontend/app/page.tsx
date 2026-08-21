"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Hotel, Promotion } from "@/lib/types";

export default function Home() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, promosRes] = await Promise.all([
          api.get("/hotels?per_page=8"),
          api.get("/promotions"),
        ]);
        setHotels(hotelsRes.data.data || []);
        setPromotions(promosRes.data.promotions || []);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set("city", searchCity);
    if (checkIn) params.set("check_in", checkIn);
    if (checkOut) params.set("check_out", checkOut);
    if (guests) params.set("capacity", guests.toString());
    window.location.href = `/hotels?${params.toString()}`;
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover Your Perfect Stay
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100">
              Book luxury rooms across Marriott, Hilton, Hyatt, and Four Seasons
              with the best price guarantee.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  City / Hotel
                </label>
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Dubai, London, Istanbul..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Search Rooms
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Hotel Chains */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Our Partner Hotel Chains
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          Five-star luxury guaranteed across four world-renowned brands
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Marriott", "Hilton", "Hyatt", "Four Seasons"].map((chain) => (
            <Link
              key={chain}
              href={`/hotels?chain=${encodeURIComponent(chain)}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="text-lg font-bold text-gray-800">{chain}</div>
              <div className="mt-1 text-xs text-gray-500">5-Star Hotel Chain</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Hotels</h2>
          <Link href="/hotels" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse h-80"></div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 relative">
                  {hotel.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <span className="text-blue-500 text-lg font-semibold">{hotel.chain}</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {hotel.chain}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{hotel.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {hotel.city}, {hotel.country}
                  </p>
                  <div className="mt-2 flex items-center space-x-1">
                    <span className="text-amber-500">
                      {"★".repeat(hotel.star_rating)}
                      <span className="text-gray-300">{"★".repeat(5 - hotel.star_rating)}</span>
                    </span>
                    {hotel.rooms_count && (
                      <span className="text-xs text-gray-500 ml-2">{hotel.rooms_count} rooms</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Current Deals</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <Link
                key={promo.id}
                href={`/hotels/${promo.hotel_id}`}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{promo.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{promo.description}</p>
                  </div>
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{promo.discount_percentage}%
                  </span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Use code: <span className="font-mono font-bold text-blue-600">{promo.code}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Book Your Stay?</h2>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            {user
              ? "Browse our wide selection of luxury 5-star hotels and find the perfect room today."
              : "Join thousands of satisfied guests. Register now to start booking your next unforgettable stay."}
          </p>
          {user ? (
            <Link
              href="/hotels"
              className="mt-6 inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Hotels
            </Link>
          ) : (
            <Link
              href="/register"
              className="mt-6 inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Account
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}