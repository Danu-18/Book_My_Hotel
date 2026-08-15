"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { PaginatedResponse, Hotel } from "@/lib/types";

export default function HotelsPage() {
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
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Browse Hotels</h1>
      <p className="mt-2 text-gray-600">Find your perfect stay across our partner chains</p>

      {/* Filters */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Chain
            </label>
            <select
              value={filters.chain}
              onChange={(e) => {
                setFilters({ ...filters, chain: e.target.value });
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Chains</option>
              {chains.map((chain) => (
                <option key={chain} value={chain}>
                  {chain}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => {
                setFilters({ ...filters, city: e.target.value });
                setPage(1);
              }}
              placeholder="Dubai, London, Istanbul..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
              placeholder="Hotel name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500">{total} hotels found</div>
      </div>

      {/* Hotel Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-72"></div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-amber-500">
                    {"★".repeat(hotel.star_rating)}
                    <span className="text-gray-300">{"★".repeat(5 - hotel.star_rating)}</span>
                  </span>
                  <span className="text-xs text-gray-500">{hotel.rooms_count ?? 0} rooms</span>
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
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={() => setPage(Math.min(lastPage, page + 1))}
            disabled={page === lastPage}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}