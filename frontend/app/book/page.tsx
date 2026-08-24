"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Room } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function BookPageContent() {
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

  // Ancillary services state
  const [ancillaryServices, setAncillaryServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<Record<number, number>>({});

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);
  const [promoError, setPromoError] = useState("");

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

  // Fetch available ancillary services for the hotel
  useEffect(() => {
    if (room) {
      const fetchServices = async () => {
        try {
          const response = await api.get(`/ancillary-services?hotel_id=${room.hotel_id}`);
          setAncillaryServices(response.data.ancillary_services || []);
        } catch (error) {
          console.error("Failed to fetch ancillary services:", error);
        }
      };
      fetchServices();
    }
  }, [room]);

  if (authLoading || loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (booked) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-background text-foreground">
        <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-primary text-3xl font-bold">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground font-display">Booking Confirmed!</h1>
          <p className="mt-2 text-sm text-foreground/80">
            Your reservation #{booked} has been confirmed. We've sent the details to your account.
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

  if (!room) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground font-display">Room not found</h1>
          <button
            onClick={() => router.push("/hotels")}
            className="mt-4 text-primary hover:underline font-medium"
          >
            ← Browse hotels
          </button>
        </div>
      </main>
    );
  }

  const handleApplyPromo = async () => {
    setPromoError("");
    if (!promoCode) return;
    try {
      const response = await api.get(`/promotions?hotel_id=${room.hotel_id}`);
      const list = response.data.promotions || [];
      const promo = list.find((p: any) => p.code.toUpperCase() === promoCode.toUpperCase());
      if (promo) {
        setAppliedPromo(promo);
      } else {
        setPromoError("Invalid or expired promo code for this hotel.");
        setAppliedPromo(null);
      }
    } catch (error) {
      console.error("Failed to check promotions:", error);
      setPromoError("Failed to validate promo code.");
    }
  };

  const nights =
    checkInParam && checkOutParam
      ? Math.max(1, (new Date(checkOutParam).getTime() - new Date(checkInParam).getTime()) / 86400000)
      : 1;

  const roomCost = parseFloat(room.price_per_night) * nights;

  const servicesCost = Object.entries(selectedServices).reduce((sum, [id, qty]) => {
    const svc = ancillaryServices.find((s) => s.id === Number(id));
    return sum + (svc ? parseFloat(svc.price) * qty : 0);
  }, 0);

  const subtotal = roomCost + servicesCost;
  const discountRate = appliedPromo ? parseFloat(appliedPromo.discount_percentage) / 100 : 0;
  const discountAmount = subtotal * discountRate;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Complete Your Booking</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 space-y-6">
          <h2 className="text-xl font-bold text-foreground font-display">Booking Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Room Type</p>
              <p className="font-semibold text-foreground">{room.room_type}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Check In</p>
                <p className="font-semibold text-foreground">{new Date(checkInParam).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Check Out</p>
                <p className="font-semibold text-foreground">{new Date(checkOutParam).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Nights</p>
                <p className="font-semibold text-foreground">{nights}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Rate</p>
                <p className="font-semibold text-foreground">
                  {parseFloat(room.price_per_night).toLocaleString()} AED / night
                </p>
              </div>
            </div>

            {/* Guests */}
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                Guests
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                >
                  {Array.from({ length: Math.min(6, room.capacity) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            {/* Special requests */}
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                Special Requests (optional)
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                  placeholder="Early check-in, airport pickup, anniversary setup..."
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                />
              </div>
            </label>

            {/* Ancillary Services checklist */}
            {ancillaryServices.length > 0 && (
              <div className="pt-4 border-t border-border/60">
                <h3 className="text-sm font-medium text-foreground font-display mb-2">Enhance Your Stay</h3>
                <div className="space-y-3">
                  {ancillaryServices.map((service) => {
                    const isSelected = selectedServices[service.id] !== undefined;
                    const qty = selectedServices[service.id] || 1;

                    return (
                      <div
                        key={service.id}
                        className={`flex items-start justify-between p-3 border rounded-xl transition-colors ${
                          isSelected ? "border-primary bg-muted/30" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices({ ...selectedServices, [service.id]: 1 });
                              } else {
                                const updated = { ...selectedServices };
                                delete updated[service.id];
                                setSelectedServices(updated);
                              }
                            }}
                            className="mt-1 h-4 w-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-foreground">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                            {isSelected && (
                              <div className="mt-2 flex items-center space-x-2">
                                <label className="text-xs text-muted-foreground font-medium">Qty:</label>
                                <select
                                  value={qty}
                                  onChange={(e) =>
                                    setSelectedServices({
                                      ...selectedServices,
                                      [service.id]: Number(e.target.value),
                                    })
                                  }
                                  className="px-2 py-0.5 border border-border rounded bg-background text-xs text-foreground"
                                >
                                  {[1, 2, 3, 4, 5, 10].map((n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-primary font-sans">
                          +{parseFloat(service.price).toLocaleString()} AED
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Promo Code input */}
            <div className="pt-4 border-t border-border/60">
              <label className="block min-w-0">
                <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                  Promo Code
                </span>
                <div className="mt-1 flex space-x-2">
                  <div className="flex-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="MARRIOTT15"
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
              </label>
              {appliedPromo && (
                <div className="mt-2 bg-muted border border-border text-foreground px-3 py-2 rounded-lg text-xs font-semibold">
                  ✓ Promotion applied: -{appliedPromo.discount_percentage}% discount
                </div>
              )}
              {promoError && (
                <div className="mt-2 bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg text-xs font-semibold">
                  ✗ {promoError}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-border/60 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room Subtotal</span>
                <span className="font-semibold text-foreground">
                  {roomCost.toLocaleString()} AED ({parseFloat(room.price_per_night).toLocaleString()} × {nights} nights)
                </span>
              </div>
              {servicesCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ancillary Services</span>
                  <span className="font-semibold text-foreground">+{servicesCost.toLocaleString()} AED</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedPromo.discount_percentage}%)</span>
                  <span className="font-semibold">-{discountAmount.toLocaleString()} AED</span>
                </div>
              )}
              <div className="pt-2 border-t border-border/60 flex justify-between text-lg font-bold">
                <span className="text-foreground font-display">Total</span>
                <span className="text-primary font-sans">{finalTotal.toLocaleString()} AED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50 self-start space-y-6">
          <h2 className="text-xl font-bold text-foreground font-display">Secure Payment</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
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
                totalPrice={finalTotal}
                services={Object.entries(selectedServices).map(([id, qty]) => ({
                  id: Number(id),
                  quantity: qty,
                }))}
                promoCode={appliedPromo ? appliedPromo.code : undefined}
                onSuccess={(id) => setBooked(id)}
              />
            </Elements>
          </div>
        </div>
      </div>
    </main>
  );
}

function CheckoutForm({
  room,
  checkIn,
  checkOut,
  guests,
  specialRequests,
  totalPrice,
  services,
  promoCode,
  onSuccess,
}: {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  totalPrice: number;
  services: Array<{ id: number; quantity: number }>;
  promoCode?: string;
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
        promo_code: promoCode || undefined,
        services: services.length > 0 ? services : undefined,
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
        <p className="text-xs text-muted-foreground">
          Test Mode: Use card 4242 4242 4242 4242, any future expiry, any CVC.
        </p>
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
        {processing ? "Processing Payment..." : `Pay ${totalPrice.toLocaleString()} AED`}
      </button>
    </form>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center py-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    }>
      <BookPageContent />
    </Suspense>
  );
}