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
    <main className="flex-1 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Deals & Promotions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Exclusive discounts and offers from our partner hotels
      </p>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl shadow-xl animate-pulse h-40"></div>
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-card rounded-2xl shadow-xl ring-1 ring-border/50">
          <h2 className="text-xl font-bold text-foreground font-display">No active promotions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for exclusive deals from our partner hotels.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="bg-primary px-6 py-4">
                <div className="flex justify-between items-center gap-4">
                  <h2 className="text-xl font-bold text-primary-foreground font-display">{promo.title}</h2>
                  <span className="bg-foreground text-background text-base font-bold px-3 py-1 rounded-full shrink-0">
                    -{promo.discount_percentage}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary-foreground/90 font-medium">{promo.hotel?.chain} · {promo.hotel?.name}</p>
              </div>
              <div className="p-6 flex flex-col justify-between h-48">
                <p className="text-xs text-foreground/80 leading-relaxed overflow-y-auto pr-1">{promo.description}</p>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
                    <div className="text-muted-foreground">
                      Valid: {new Date(promo.start_date).toLocaleDateString()} →{" "}
                      {new Date(promo.end_date).toLocaleDateString()}
                    </div>
                    {promo.code && (
                      <div className="text-foreground">
                        Code:{" "}
                        <span className="font-mono font-bold text-primary bg-muted px-2 py-0.5 rounded-md">
                          {promo.code}
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/hotels/${promo.hotel_id}`}
                    className="mt-4 block w-full text-center py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 text-sm"
                  >
                    Book This Hotel
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}