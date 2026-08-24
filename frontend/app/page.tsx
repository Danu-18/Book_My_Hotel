"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
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
    <main className="flex-1 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Sunlit coral reef"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 size-full object-cover opacity-70"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="font-display text-4xl font-bold leading-tight text-cocoa sm:text-5xl lg:text-6xl">
            Discover Your Perfect Stay
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-cocoa/80 sm:text-lg">
            Book luxury rooms across Marriott, Hilton, Hyatt, and Four Seasons with the best price
            guarantee.
          </p>

          {/* Search Card Form */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-3xl rounded-2xl bg-sand/90 p-4 text-left shadow-[var(--shadow-card)] ring-1 ring-border/50 backdrop-blur sm:p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
              <Field label="City / Hotel">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-cocoa font-semibold"
                    placeholder="Dubai, London, Istanbul..."
                  />
                </div>
              </Field>
              <Field label="Check In">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-cocoa font-semibold"
                />
              </Field>
              <Field label="Check Out">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-cocoa font-semibold"
                />
              </Field>
              <Field label="Guests">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-cocoa font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <Users className="size-4 shrink-0 text-muted-foreground" />
                </div>
              </Field>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-clay px-6 py-3 text-sm font-semibold text-clay-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90 cursor-pointer"
            >
              Search Rooms
            </button>
          </form>
        </div>
      </section>

      {/* Partners Section */}
      <section
        className="px-4 py-14 sm:px-6"
        style={{ backgroundImage: "var(--gradient-partners)" }}
      >
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-cocoa sm:text-3xl font-display">Our Partner Hotel Chains</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Five-star luxury guaranteed across four world-renowned brands
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {["Marriott", "Hilton", "Hyatt", "Four Seasons"].map((chain) => (
              <Link
                key={chain}
                href={`/hotels?chain=${encodeURIComponent(chain)}`}
                className="flex h-24 items-center justify-center rounded-xl bg-card px-4 shadow-[var(--shadow-soft)] sm:h-28 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span className="truncate font-display text-lg font-bold tracking-wide text-clay sm:text-2xl">
                  {chain}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="truncate text-2xl font-bold text-cocoa sm:text-3xl font-display">Featured Hotels</h2>
          <Link
            href="/hotels"
            className="flex shrink-0 items-center gap-1 text-sm text-foreground/80 hover:text-primary font-medium"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl shadow-[var(--shadow-card)] animate-pulse h-72"
              ></div>
            ))
          ) : (
            hotels.map((h) => (
              <Link
                key={h.id}
                href={`/hotels/${h.id}`}
                className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 block cursor-pointer"
              >
                <div className="h-44 w-full relative bg-gray-100">
                  {h.image_url ? (
                    <img
                      src={h.image_url}
                      alt={h.name}
                      loading="lazy"
                      width={768}
                      height={576}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-50">
                      <span className="text-blue-500 font-semibold">{h.chain}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-4">
                  <h3 className="truncate font-sans text-base font-semibold text-cocoa">{h.name}</h3>
                  <p className="text-sm text-muted-foreground">{h.city}, {h.country}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex">
                      {Array.from({ length: h.star_rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-primary text-primary" />
                      ))}
                      {Array.from({ length: 5 - h.star_rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 text-muted/40" />
                      ))}
                    </div>
                    {h.rooms_count && (
                      <span className="text-xs text-muted-foreground ml-1">{h.rooms_count} rooms</span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Deals & Promotions Section */}
      {promotions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-bold text-cocoa sm:text-3xl font-display">Current Deals</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {promotions.map((p) => (
              <Link
                key={p.id}
                href={`/hotels/${p.hotel_id}`}
                className="rounded-xl bg-peach/60 p-5 hover:shadow-md transition-shadow block cursor-pointer"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <h3 className="min-w-0 font-sans text-base font-semibold text-cocoa">{p.title}</h3>
                  <span className="shrink-0 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-clay-foreground">
                    -{p.discount_percentage}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-cocoa/75">{p.description}</p>
                <p className="mt-3 text-xs text-cocoa/70">
                  Use code: <span className="font-semibold tracking-wide text-cocoa">{p.code}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-clay px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-clay-foreground sm:text-4xl font-display">
          Ready to Book Your Stay?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-clay-foreground/85 sm:text-base">
          {user
            ? "Browse our wide selection of luxury 5-star hotels and find the perfect room today."
            : "Join thousands of satisfied guests. Register now to start booking your next unforgettable stay."}
        </p>
        {user ? (
          <Link
            href="/hotels"
            className="mt-8 inline-block rounded-lg bg-cocoa px-8 py-3 text-sm font-semibold text-cocoa-foreground shadow-[var(--shadow-card)] transition-opacity hover:opacity-90 cursor-pointer"
          >
            Browse Hotels
          </Link>
        ) : (
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-cocoa px-8 py-3 text-sm font-semibold text-cocoa-foreground shadow-[var(--shadow-card)] transition-opacity hover:opacity-90 cursor-pointer"
          >
            Create Account
          </Link>
        )}
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 rounded-lg bg-card px-3 py-2.5 ring-1 ring-border">{children}</div>
    </label>
  );
}