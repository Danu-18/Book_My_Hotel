"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Promotion } from "@/lib/types";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get("/promotions");
        setPromotions(response.data.promotions || []);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Deals & Promotions</h1>
      <p className="mt-2 text-gray-600">
        Exclusive discounts and offers from our partner hotels
      </p>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-40"></div>
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No active promotions</h2>
          <p className="mt-2 text-gray-600">
            Check back soon for exclusive deals from our partner hotels.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{promo.title}</h2>
                  <span className="bg-red-600 text-white text-lg font-bold px-3 py-1 rounded-full">
                    -{promo.discount_percentage}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-blue-100">{promo.hotel?.chain} · {promo.hotel?.name}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{promo.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Valid: {new Date(promo.start_date).toLocaleDateString()} →{" "}
                    {new Date(promo.end_date).toLocaleDateString()}
                  </div>
                  {promo.code && (
                    <div className="text-sm">
                      Code:{" "}
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {promo.code}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/hotels/${promo.hotel_id}`}
                  className="mt-4 inline-block w-full text-center py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Book This Hotel
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}