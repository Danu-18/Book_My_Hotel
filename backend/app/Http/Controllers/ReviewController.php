<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews for a hotel.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'hotel_id' => ['required', 'exists:hotels,id'],
        ]);

        $reviews = Review::with('user')
            ->where('hotel_id', $request->input('hotel_id'))
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return response()->json($reviews);
    }

    /**
     * Store a newly created review (Authenticated users only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => ['required', 'exists:hotels,id'],
            'room_id' => ['required', 'exists:rooms,id'],
            'reservation_id' => ['required', 'exists:reservations,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        // Verify the user actually stayed in that specific room and hotel
        $reservation = \App\Models\Reservation::with('room')->where('id', $validated['reservation_id'])
            ->where('user_id', $request->user()->id)
            ->where('room_id', $validated['room_id'])
            ->where('status', 'completed')
            ->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'You can only review rooms from your own completed bookings.',
            ], 403);
        }

        if ($reservation->room->hotel_id != $validated['hotel_id']) {
            return response()->json([
                'message' => 'The selected room does not belong to the selected hotel.',
            ], 422);
        }

        // Prevent duplicate reviews for the same hotel
        $existing = Review::where('user_id', $request->user()->id)
            ->where('hotel_id', $validated['hotel_id'])
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'You have already reviewed this hotel.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'hotel_id' => $validated['hotel_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review->load('user'),
        ], 201);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        // Only the review author or admin can update
        if ($review->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully.',
            'review' => $review->fresh()->load('user'),
        ]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        // Only the review author or admin can delete
        if ($review->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully.',
        ]);
    }
}