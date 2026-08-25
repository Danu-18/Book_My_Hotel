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
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (paid) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-background text-foreground">
        <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-primary text-3xl font-bold">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground font-display">Payment Successful!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your payment has been processed and your reservation is confirmed.
          </p>
          <button
            onClick={() => router.push("/reservations")}
            className="mt-6 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
          >
            View My Bookings
          </button>
        </div>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground font-display">Reservation not found</h1>
          <button
            onClick={() => router.push("/reservations")}
            className="mt-4 text-primary hover:underline font-medium"
          >
            ← Back to my bookings
          </button>
        </div>
      </main>
    );
  }

  if (reservation.status === "confirmed") {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-background text-foreground">
        <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full text-center ring-1 ring-border/50">
          <h1 className="text-2xl font-bold text-foreground font-display">Already Paid</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This reservation is already confirmed and paid.
          </p>
          <button
            onClick={() => router.push("/reservations")}
            className="mt-6 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
          >
            View My Bookings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Complete Payment</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
          <h2 className="text-xl font-bold text-foreground font-display">Booking Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hotel</span>
              <span className="font-semibold text-foreground">{reservation.room?.hotel?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-semibold text-foreground">{reservation.room?.room_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check In</span>
              <span className="font-semibold text-foreground">{new Date(reservation.check_in_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check Out</span>
              <span className="font-semibold text-foreground">{new Date(reservation.check_out_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-semibold text-foreground">{reservation.guests}</span>
            </div>
            <div className="pt-4 border-t border-border/60 flex justify-between items-baseline">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-primary text-xl">
                {parseFloat(reservation.total_price).toLocaleString()} AED
              </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
          <h2 className="text-xl font-bold text-foreground font-display">Secure Payment</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card Details</label>
        <div className="p-3.5 border border-border rounded-lg bg-background">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#380560",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>
          {/* <p className="text-xs text-muted-foreground">
            Test Mode: Use card 4242 4242 4242 4242, any future expiry, any CVC.
          </p> */}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {processing ? "Processing Payment..." : `Pay ${parseFloat(reservation.total_price).toLocaleString()} AED`}
      </button>
    </form>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center py-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    }>
      <PayPageContent />
    </Suspense>
  );
}