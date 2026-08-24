"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function NewHotelPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    chain: "",
    location: "",
    city: "",
    country: "",
    description: "",
    star_rating: 5,
    image_url: "",
    amenities: "",
    latitude: 0.0,
    longitude: 0.0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login?next=/admin/hotels/new");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        star_rating: Number(formData.star_rating),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        amenities: formData.amenities
          ? formData.amenities.split(",").map((a) => a.trim().toLowerCase()).filter((a) => a !== "")
          : [],
      };

      await api.post("/hotels", payload);
      alert("Hotel created successfully!");
      router.push("/admin");
    } catch (err: unknown) {
      console.error("Failed to create hotel:", err);
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || "Failed to create hotel. Please check inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-8 my-10 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-border/60">
          <h1 className="text-2xl font-bold text-foreground font-display">Add New Hotel</h1>
          <button
            onClick={() => router.push("/admin")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Hotel Name
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Marriott Downtown Dubai"
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Hotel Chain
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <select
                  required
                  value={formData.chain}
                  onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                >
                  <option value="">Select Chain</option>
                  <option value="Marriott">Marriott</option>
                  <option value="Hilton">Hilton</option>
                  <option value="Hyatt">Hyatt</option>
                  <option value="Four Seasons">Four Seasons</option>
                </select>
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Star Rating
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <select
                  required
                  value={formData.star_rating}
                  onChange={(e) => setFormData({ ...formData, star_rating: Number(e.target.value) })}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </label>
          </div>

          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Location Address
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Sheikh Zayed Road"
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                City
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Dubai"
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Country
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="UAE"
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                />
              </div>
            </label>
          </div>

          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Image URL
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
              />
            </div>
          </label>

          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Amenities (comma-separated)
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="pool, spa, gym, restaurant, wifi"
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Latitude (optional)
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Longitude (optional)
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                />
              </div>
            </label>
          </div>

          <label className="block min-w-0">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
              Description
            </span>
            <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="A luxury 5-star hotel..."
                className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Creating..." : "Create Hotel"}
          </button>
        </form>
      </div>
    </main>
  );
}
