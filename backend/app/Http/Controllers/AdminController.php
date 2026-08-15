<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get the analytics dashboard data (Admin only).
     */
    public function analytics(Request $request): JsonResponse
    {
        // Date range filter
        $startDate = $request->has('start_date') ? Carbon::parse($request->input('start_date')) : Carbon::now()->startOfMonth();
        $endDate = $request->has('end_date') ? Carbon::parse($request->input('end_date')) : Carbon::now()->endOfMonth();

        $reservations = Reservation::where('status', 'confirmed')
            ->whereBetween('check_in_date', [$startDate->toDateString(), $endDate->toDateString()]);

        // Room nights = number of nights across all confirmed reservations
        $roomNights = $reservations->get()->sum(function ($reservation) {
            return Carbon::parse($reservation->check_in_date)->diffInDays(Carbon::parse($reservation->check_out_date));
        });

        // Room revenue = total amount paid
        $roomRevenue = Payment::where('status', 'succeeded')
            ->whereBetween('created_at', [$startDate->startOfDay(), $endDate->endOfDay()])
            ->sum('amount');

        // Average Daily Rate = Room Revenue / Room Nights
        $adr = $roomNights > 0 ? round($roomRevenue / $roomNights, 2) : 0;

        // Per-hotel breakdown
        $hotels = Hotel::with('rooms')->get()->map(function ($hotel) use ($startDate, $endDate) {
            $hotelRoomIds = $hotel->rooms->pluck('id');

            $hotelReservations = Reservation::where('status', 'confirmed')
                ->whereIn('room_id', $hotelRoomIds)
                ->whereBetween('check_in_date', [$startDate->toDateString(), $endDate->toDateString()])
                ->get();

            $hotelRoomNights = $hotelReservations->sum(function ($reservation) {
                return Carbon::parse($reservation->check_in_date)->diffInDays(Carbon::parse($reservation->check_out_date));
            });

            return [
                'hotel' => $hotel->name,
                'chain' => $hotel->chain,
                'room_nights' => $hotelRoomNights,
            ];
        });

        return response()->json([
            'summary' => [
                'room_nights' => $roomNights,
                'room_revenue' => (float) $roomRevenue,
                'average_daily_rate' => $adr,
                'total_reservations' => $reservations->count(),
            ],
            'by_hotel' => $hotels,
            'date_range' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
        ]);
    }

    /**
     * Display all reservations (Admin only).
     */
    public function allReservations(Request $request): JsonResponse
    {
        $query = Reservation::with(['user', 'room.hotel', 'payment']);

        // Filter by date
        if ($request->has('date')) {
            $date = Carbon::parse($request->input('date'))->toDateString();
            $query->where('check_in_date', '<=', $date)
                ->where('check_out_date', '>', $date);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $reservations = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15));

        return response()->json($reservations);
    }

    /**
     * List all users (Admin only).
     */
    public function users(Request $request): JsonResponse
    {
        $users = User::withCount('reservations')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($users);
    }
}