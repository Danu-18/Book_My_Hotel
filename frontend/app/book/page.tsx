"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Room } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm({
  room,
  checkIn,
  checkOut,
  guests,
  specialRequests,
  totalPrice,
  onSuccess,
}: {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  totalPrice: number;
  onSuccess: (reservationId: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    try {
      // Create reservation and get client secret
      const response = await api.post("/reservations", {
        room_id: room.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests,
        special_requests: specialRequests || undefined,
      });

      const { client_secret, reservation } = response.data;

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed.");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // Confirm the reservation on the backend
        await api.post(`/reservations/${reservation.id}/confirm`);
        onSuccess(reservation.id);
      } else {
        setError("Payment was not successful. Please try again.");
      }
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || "Failed to process booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="mt-1 p-3 border border-gray-300 rounded-md bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Test Mode: Use card 4242 4242 4242 4242, any future expiry, any CVC.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Processing Payment..." : `Pay ${totalPrice.toLocaleString()} AED`}
      </button>
    </form>
  );
}

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const roomId = searchParams.get("room_id");
  const checkInParam = searchParams.get("check_in") || "";
  const checkOutParam = searchParams.get("check_out") || "";

  const [room, setRoom] = useState<Room | null>(null);
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?next=/book?room_id=${roomId}&check_in=${checkInParam}&check_out=${checkOutParam}`);
      return;
    }

    if (roomId) {
      const fetchRoom = async () => {
        try {
          const response = await api.get(`/rooms/${roomId}`);
          setRoom(response.data.room);
        } catch (error) {
          console.error("Failed to fetch room:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    } else {
      setLoading(false);
    }
  }, [roomId, user, authLoading, router, checkInParam, checkOutParam]);

  if (authLoading || loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (booked) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Your reservation #{booked} has been confirmed. We've sent the details to your account.
          </p>
          <button
            onClick={() => router.push("/reservations")}
            className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Room not found</h1>
          <button
            onClick={() => router.push("/hotels")}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Browse hotels
          </button>
        </div>
      </main>
    );
  }

  const nights =
    checkInParam && checkOutParam
      ? Math.max(1, (new Date(checkOutParam).getTime() - new Date(checkInParam).getTime()) / 86400000)
      : 1;
  const totalPrice = parseFloat(room.price_per_night) * nights;

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Room Type</p>
              <p className="font-semibold text-gray-900">{room.room_type}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Check In</p>
                <p className="font-semibold text-gray-900">{new Date(checkInParam).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check Out</p>
                <p className="font-semibold text-gray-900">{new Date(checkOutParam).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nights</p>
                <p className="font-semibold text-gray-900">{nights}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rate</p>
                <p className="font-semibold text-gray-900">
                  {parseFloat(room.price_per_night).toLocaleString()} AED / night
                </p>
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {Array.from({ length: Math.min(6, room.capacity) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Special requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Requests (optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                placeholder="Early check-in, airport pickup, anniversary setup..."
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {parseFloat(room.price_per_night).toLocaleString()} × {nights} nights
                </span>
              </div>
              <div className="mt-2 flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">{totalPrice.toLocaleString()} AED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
          <p className="mt-2 text-sm text-gray-500">
            Payment is processed securely via Stripe. We never store your card details.
          </p>
          <div className="mt-6">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                room={room}
                checkIn={checkInParam}
                checkOut={checkOutParam}
                guests={guests}
                specialRequests={specialRequests}
                totalPrice={totalPrice}
                onSuccess={(id) => setBooked(id)}
              />
            </Elements>
          </div>
        </div>
      </div>
    </main>
  );
}