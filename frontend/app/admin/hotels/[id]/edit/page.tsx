"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditHotelPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const hotelId = params.id;
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login?next=/admin/hotels/" + hotelId + "/edit");
      return;
    }

    if (user?.role === "admin" && hotelId) {
      const fetchHotelData = async () => {
        try {
          const response = await api.get(`/hotels/${hotelId}`);
          const hotel = response.data.hotel;
          if (hotel) {
            setFormData({
              name: hotel.name || "",
              chain: hotel.chain || "",
              location: hotel.location || "",
              city: hotel.city || "",
              country: hotel.country || "",
              description: hotel.description || "",
              star_rating: hotel.star_rating || 5,
              image_url: hotel.image_url || "",
              amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : "",
              latitude: Number(hotel.latitude) || 0.0,
              longitude: Number(hotel.longitude) || 0.0,
            });
          }
        } catch (err) {
          console.error("Failed to load hotel data:", err);
          setError("Failed to load hotel details.");
        } finally {
          setLoading(false);
        }
      };
      fetchHotelData();
    }
  }, [authLoading, user, hotelId, router]);

  if (authLoading || loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
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

      await api.put(`/hotels/${hotelId}`, payload);
      alert("Hotel updated successfully!");
      router.push("/admin");
    } catch (err: unknown) {
      console.error("Failed to update hotel:", err);
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || "Failed to update hotel. Please check inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-white rounded-lg shadow-sm border border-gray-100 my-10">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Edit Hotel Details</h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hotel Chain</label>
            <select
              required
              value={formData.chain}
              onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select Chain</option>
              <option value="Marriott">Marriott</option>
              <option value="Hilton">Hilton</option>
              <option value="Hyatt">Hyatt</option>
              <option value="Four Seasons">Four Seasons</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Star Rating</label>
            <select
              required
              value={formData.star_rating}
              onChange={(e) => setFormData({ ...formData, star_rating: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location Address</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
          <input
            type="text"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude (optional)</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude (optional)</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Hotel"}
        </button>
      </form>
    </main>
  );
}
