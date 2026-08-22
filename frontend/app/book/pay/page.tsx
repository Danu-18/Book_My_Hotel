"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Reservation } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function PayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation_id");
  const { user, loading: authLoading } = useAuth();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?next=/book/pay?reservation_id=${reservationId}`);
      return;
    }

    if (reservationId && user) {
      const fetchReservation = async () => {
        try {
          const response = await api.get(`/reservations/${reservationId}`);
          setReservation(response.data.reservation);
        } catch (error) {
          console.error("Failed to fetch reservation:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReservation();
    } else {
      setLoading(false);
    }
  }, [reservationId, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (paid) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">
            Your payment has been processed and your reservation is confirmed.
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

  if (!reservation) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reservation not found</h1>
          <button
            onClick={() => router.push("/reservations")}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to my bookings
          </button>
        </div>
      </main>
    );
  }

  if (reservation.status === "confirmed") {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900">Already Paid</h1>
          <p className="mt-2 text-gray-600">
            This reservation is already confirmed and paid.
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

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Hotel</span>
              <span className="font-semibold text-gray-900">{reservation.room?.hotel?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room</span>
              <span className="font-semibold text-gray-900">{reservation.room?.room_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check In</span>
              <span className="font-semibold text-gray-900">{new Date(reservation.check_in_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check Out</span>
              <span className="font-semibold text-gray-900">{new Date(reservation.check_out_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guests</span>
              <span className="font-semibold text-gray-900">{reservation.guests}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-blue-600 text-xl">
                {parseFloat(reservation.total_price).toLocaleString()} AED
              </span>
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
              <PaymentForm reservation={reservation} onSuccess={() => setPaid(true)} />
            </Elements>
          </div>
        </div>
      </div>
    </main>
  );
}

function PaymentForm({
  reservation,
  onSuccess,
}: {
  reservation: Reservation;
  onSuccess: () => void;
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
      // Get a fresh payment intent client secret by re-creating the payment
      const response = await api.post(`/reservations/${reservation.id}/confirm`);

      // If the reservation is already confirmed, skip payment
      if (response.data.reservation?.status === "confirmed") {
        onSuccess();
        return;
      }

      // Fallback: try to resume pending payment using the existing payment intent
      const { client_secret } = response.data;

      if (!client_secret) {
        setError("Unable to retrieve payment details. Please try again.");
        return;
      }

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
        await api.post(`/reservations/${reservation.id}/confirm`);
        onSuccess();
      } else {
        setError("Payment was not successful. Please try again.");
      }
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || "Failed to process payment. Please try again.");
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
        {processing ? "Processing Payment..." : `Pay ${parseFloat(reservation.total_price).toLocaleString()} AED`}
      </button>
    </form>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    }>
      <PayPageContent />
    </Suspense>
  );
}