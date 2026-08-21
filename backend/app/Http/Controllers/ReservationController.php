<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class ReservationController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Display a listing of reservations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with(['room.hotel', 'payment'])
            ->where('user_id', $request->user()->id);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $reservations = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 10));

        return response()->json($reservations);
    }

    /**
     * Display reservations for a specific date (Admin/Hotel Staff).
     */
    public function byDate(Request $request): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date'],
        ]);

        $date = Carbon::parse($request->input('date'))->toDateString();

        $reservations = Reservation::with(['user', 'room.hotel'])
            ->where('check_in_date', '<=', $date)
            ->where('check_out_date', '>', $date)
            ->where('status', 'confirmed')
            ->orderBy('check_in_date')
            ->get();

        return response()->json(['reservations' => $reservations]);
    }

    /**
     * Store a newly created reservation and create Stripe payment intent.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'guests' => ['required', 'integer', 'min:1', 'max:10'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
            'promo_code' => ['nullable', 'string', 'max:50'],
            'services' => ['nullable', 'array'],
            'services.*.id' => ['required_with:services', 'exists:ancillary_services,id'],
            'services.*.quantity' => ['required_with:services', 'integer', 'min:1'],
        ]);

        $room = Room::findOrFail($validated['room_id']);

        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $nights = $checkIn->diffInDays($checkOut);

        // Check for conflicting reservations
        $conflict = Reservation::where('room_id', $room->id)
            ->where('status', 'confirmed')
            ->where('check_in_date', '<', $checkOut->toDateString())
            ->where('check_out_date', '>', $checkIn->toDateString())
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This room is not available for the selected dates.',
                'errors' => ['room_id' => ['Room is already booked for the selected dates.']],
            ], 422);
        }

        $totalPrice = $room->price_per_night * $nights;

        // Calculate ancillary services cost
        $ancillaryCost = 0;
        if ($request->filled('services')) {
            foreach ($request->input('services') as $s) {
                $service = \App\Models\AncillaryService::findOrFail($s['id']);
                $ancillaryCost += $service->price * $s['quantity'];
            }
        }
        $totalPrice += $ancillaryCost;

        // Apply promo code if provided
        if ($request->filled('promo_code')) {
            $today = Carbon::today()->toDateString();
            $promotion = \App\Models\Promotion::where('code', $request->input('promo_code'))
                ->where('hotel_id', $room->hotel_id)
                ->where('is_active', true)
                ->where('start_date', '<=', $today)
                ->where('end_date', '>=', $today)
                ->first();

            if ($promotion) {
                $discount = $totalPrice * ($promotion->discount_percentage / 100);
                $totalPrice = max(0, $totalPrice - $discount);
            }
        }

        // Create the reservation as pending
        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'room_id' => $room->id,
            'check_in_date' => $checkIn->toDateString(),
            'check_out_date' => $checkOut->toDateString(),
            'guests' => $validated['guests'],
            'total_price' => $totalPrice,
            'status' => 'pending',
            'special_requests' => $validated['special_requests'] ?? null,
        ]);

        // Attach ancillary services to the reservation
        if ($request->filled('services')) {
            foreach ($request->input('services') as $s) {
                $service = \App\Models\AncillaryService::findOrFail($s['id']);
                $reservation->ancillaryServices()->attach($service->id, [
                    'quantity' => $s['quantity'],
                    'price_at_booking' => $service->price,
                ]);
            }
        }

        // Create Stripe Payment Intent
        $paymentIntent = PaymentIntent::create([
            'amount' => (int) round($totalPrice * 100), // Convert to cents
            'currency' => 'aed',
            'metadata' => [
                'reservation_id' => $reservation->id,
                'user_id' => $request->user()->id,
            ],
        ]);

        Payment::create([
            'reservation_id' => $reservation->id,
            'user_id' => $request->user()->id,
            'stripe_payment_intent_id' => $paymentIntent->id,
            'amount' => $totalPrice,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Reservation created. Please complete payment.',
            'reservation' => $reservation->load(['room.hotel', 'payment', 'ancillaryServices']),
            'client_secret' => $paymentIntent->client_secret,
        ], 201);
    }

    /**
     * Display the specified reservation.
     */
    public function show(Request $request, Reservation $reservation): JsonResponse
    {
        // Users can only view their own reservations unless admin/staff
        if ($reservation->user_id !== $request->user()->id && ! in_array($request->user()->role, ['admin', 'staff'])) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json([
            'reservation' => $reservation->load(['room.hotel', 'payment', 'user']),
        ]);
    }

    /**
     * Update the reservation status (confirm after payment).
     */
    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:pending,confirmed,cancelled,completed'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Reservation updated successfully.',
            'reservation' => $reservation->fresh()->load(['room.hotel', 'payment']),
        ]);
    }

    /**
     * Cancel the specified reservation.
     */
    public function cancel(Request $request, Reservation $reservation): JsonResponse
    {
        // Users can only cancel their own reservations
        if ($reservation->user_id !== $request->user()->id && ! in_array($request->user()->role, ['admin'])) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($reservation->status === 'cancelled') {
            return response()->json(['message' => 'Reservation is already cancelled.'], 422);
        }

        $reservation->update(['status' => 'cancelled']);

        // Refund via Stripe if payment was made
        if ($reservation->payment) {
            try {
                $paymentIntentId = $reservation->payment->stripe_payment_intent_id;

                if ($reservation->payment->status === 'succeeded') {
                    // Create refund for succeeded payments
                    \Stripe\Refund::create(['payment_intent' => $paymentIntentId]);
                    $reservation->payment->update(['status' => 'refunded']);
                } else {
                    // Retrieve PaymentIntent to verify status
                    $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
                    if ($paymentIntent->status !== 'succeeded') {
                        $paymentIntent->cancel();
                    }
                    $reservation->payment->update(['status' => 'cancelled']);
                }
            } catch (\Exception $e) {
                // Log refund/cancellation failure but don't block cancellation
                \Log::error('Stripe refund/cancellation failed: '.$e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Reservation cancelled successfully.',
            'reservation' => $reservation->fresh()->load(['room.hotel', 'payment']),
        ]);
    }

    /**
     * Confirm a reservation after successful payment.
     */
    public function confirm(Request $request, Reservation $reservation): JsonResponse
    {
        $payment = $reservation->payment;

        if (! $payment) {
            return response()->json(['message' => 'No payment found for this reservation.'], 422);
        }

        // Verify the payment intent status with Stripe
        $paymentIntent = PaymentIntent::retrieve($payment->stripe_payment_intent_id);

        if ($paymentIntent->status === 'succeeded') {
            $reservation->update(['status' => 'confirmed']);
            $payment->update(['status' => 'succeeded', 'payment_method' => $paymentIntent->payment_method]);

            return response()->json([
                'message' => 'Payment confirmed. Reservation is now confirmed.',
                'reservation' => $reservation->fresh()->load(['room.hotel', 'payment']),
            ]);
        }

        // Return the client secret so the client can complete the pending payment
        return response()->json([
            'message' => 'Payment has not been completed yet.',
            'status' => $paymentIntent->status,
            'client_secret' => $paymentIntent->client_secret,
        ]);
    }
}