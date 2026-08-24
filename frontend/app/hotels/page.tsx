"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import type { PaginatedResponse, Hotel } from "@/lib/types";

function HotelsPageContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    chain: searchParams.get("chain") || "",
    city: searchParams.get("city") || "",
    search: "",
  });

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (filters.chain) params.set("chain", filters.chain);
      if (filters.city) params.set("city", filters.city);
      if (filters.search) params.set("search", filters.search);

      const response = await api.get<PaginatedResponse<Hotel>>(`/hotels?${params}`);
      setHotels(response.data.data);
      setLastPage(response.data.last_page);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page, filters]);

  const chains = ["Marriott", "Hilton", "Hyatt", "Four Seasons"];

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Browse Hotels</h1>
      <p className="mt-2 text-sm text-muted-foreground">Find your perfect stay across our partner chains</p>

      {/* Filters */}
      <div className="mt-6 bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Chain
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <select
                value={filters.chain}
                onChange={(e) => {
                  setFilters({ ...filters, chain: e.target.value });
                  setPage(1);
                }}
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
              >
                <option value="">All Chains</option>
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              City
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <input
                type="text"
                value={filters.city}
                onChange={(e) => {
                  setFilters({ ...filters, city: e.target.value });
                  setPage(1);
                }}
                placeholder="Dubai, London, Istanbul..."
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
              />
            </div>
          </label>

          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Search
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                placeholder="Hotel name..."
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
              />
            </div>
          </label>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">{total} hotels found</div>
      </div>

      {/* Hotel Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl shadow animate-pulse h-72"></div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 overflow-hidden hover:shadow-2xl transition-all flex flex-col hover:-translate-y-1 block cursor-pointer"
            >
              <div className="h-48 bg-muted relative">
                {hotel.image_url ? (
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-primary text-lg font-semibold font-display">{hotel.chain}</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                  {hotel.chain}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-foreground truncate text-base font-display">{hotel.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hotel.city}, {hotel.country}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex">
                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary text-primary" />
                    ))}
                    {Array.from({ length: 5 - hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 text-muted/40" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{hotel.rooms_count ?? 0} rooms</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-xs text-muted-foreground font-semibold">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={() => setPage(Math.min(lastPage, page + 1))}
            disabled={page === lastPage}
            className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center py-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    }>
      <HotelsPageContent />
    </Suspense>
  );
}