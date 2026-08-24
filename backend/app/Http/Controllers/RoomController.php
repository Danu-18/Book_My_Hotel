<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms with search and filter options.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Room::query()->with('hotel')->where('is_active', true);

        // Enforce strict data isolation for staff
        $user = $request->user('sanctum');
        if ($user && $user->role === 'staff') {
            $query->where('hotel_id', $user->hotel_id);
        } else {
            // Filter by hotel
            if ($request->has('hotel_id')) {
                $query->where('hotel_id', $request->input('hotel_id'));
            }
        }

        // Filter by room type
        if ($request->has('room_type')) {
            $query->where('room_type', $request->input('room_type'));
        }

        // Filter by maximum price
        if ($request->has('max_price')) {
            $query->where('price_per_night', '<=', $request->input('max_price'));
        }

        // Filter by minimum price
        if ($request->has('min_price')) {
            $query->where('price_per_night', '>=', $request->input('min_price'));
        }

        // Filter by capacity
        if ($request->has('capacity')) {
            $query->where('capacity', '>=', $request->input('capacity'));
        }

        // Availability check: only show rooms with remaining inventory
        if ($request->has('check_in') && $request->has('check_out')) {
            $checkIn = Carbon::parse($request->input('check_in'))->toDateString();
            $checkOut = Carbon::parse($request->input('check_out'))->toDateString();

            $query->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereRaw('available_rooms > (
                    select count(*) from reservations 
                    where reservations.room_id = rooms.id 
                    and reservations.status in (\'confirmed\', \'pending\')
                    and reservations.check_in_date < ?
                    and reservations.check_out_date > ?
                )', [$checkOut, $checkIn]);
            });
        }

        $rooms = $query->paginate($request->input('per_page', 12));

        return response()->json($rooms);
    }

    /**
     * Store a newly created room (Admin/Hotel Staff).
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'room_type' => ['required', 'string', 'max:100'],
            'room_number' => ['required', 'string', 'max:50', 'unique:rooms'],
            'capacity' => ['required', 'integer', 'min:1', 'max:20'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'total_rooms' => ['required', 'integer', 'min:1'],
            'available_rooms' => ['required', 'integer', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'image_url' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];

        if ($request->user()->role === 'admin') {
            $rules['hotel_id'] = ['required', 'exists:hotels,id'];
        }

        $validated = $request->validate($rules);

        if ($request->user()->role === 'staff') {
            $validated['hotel_id'] = $request->user()->hotel_id;
        }

        $room = Room::create($validated);

        return response()->json([
            'message' => 'Room created successfully.',
            'room' => $room->load('hotel'),
        ], 201);
    }

    /**
     * Display the specified room.
     */
    public function show(Room $room): JsonResponse
    {
        return response()->json([
            'room' => $room->load(['hotel', 'reservations' => function ($query) {
                $query->whereIn('status', ['pending', 'confirmed'])->orderBy('check_in_date');
            }]),
        ]);
    }

    /**
     * Update the specified room (Admin/Hotel Staff).
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        if ($request->user()->role === 'staff' && $room->hotel_id !== $request->user()->hotel_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $rules = [
            'room_type' => ['sometimes', 'string', 'max:100'],
            'room_number' => ['sometimes', 'string', 'max:50', 'unique:rooms,room_number,'.$room->id],
            'capacity' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0'],
            'total_rooms' => ['sometimes', 'integer', 'min:1'],
            'available_rooms' => ['sometimes', 'integer', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'image_url' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];

        if ($request->user()->role === 'admin') {
            $rules['hotel_id'] = ['sometimes', 'exists:hotels,id'];
        }

        $validated = $request->validate($rules);

        if ($request->user()->role === 'staff') {
            $validated['hotel_id'] = $request->user()->hotel_id;
        }

        $room->update($validated);

        return response()->json([
            'message' => 'Room updated successfully.',
            'room' => $room->fresh()->load('hotel'),
        ]);
    }

    /**
     * Remove the specified room (Admin only / Staff bound to hotel).
     */
    public function destroy(Request $request, Room $room): JsonResponse
    {
        if ($request->user()->role === 'staff' && $room->hotel_id !== $request->user()->hotel_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully.',
        ]);
    }
}