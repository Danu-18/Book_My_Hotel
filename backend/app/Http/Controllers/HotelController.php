<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * Display a listing of hotels with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Hotel::query()->with('rooms');

        // Filter by chain
        if ($request->has('chain')) {
            $query->where('chain', $request->input('chain'));
        }

        // Filter by city
        if ($request->has('city')) {
            $query->where('city', 'like', '%'.$request->input('city').'%');
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->input('search').'%');
        }

        $hotels = $query->withCount('rooms')->paginate($request->input('per_page', 12));

        return response()->json($hotels);
    }

    /**
     * Store a newly created hotel (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'chain' => ['required', 'string', 'in:Marriott,Hilton,Hyatt,Four Seasons'],
            'location' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'star_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'image_url' => ['nullable', 'string'],
            'amenities' => ['nullable', 'array'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);

        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully.',
            'hotel' => $hotel->load('rooms'),
        ], 201);
    }

    /**
     * Display the specified hotel with its rooms and reviews.
     */
    public function show(Hotel $hotel): JsonResponse
    {
        return response()->json([
            'hotel' => $hotel->load(['rooms', 'reviews.user', 'reviews' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }]),
        ]);
    }

    /**
     * Update the specified hotel (Admin only).
     */
    public function update(Request $request, Hotel $hotel): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'chain' => ['sometimes', 'string', 'enum:Marriott,Hilton,Hyatt,Four Seasons'],
            'location' => ['sometimes', 'string', 'max:255'],
            'city' => ['sometimes', 'string', 'max:255'],
            'country' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'star_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'image_url' => ['nullable', 'string'],
            'amenities' => ['nullable', 'array'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);

        $hotel->update($validated);

        return response()->json([
            'message' => 'Hotel updated successfully.',
            'hotel' => $hotel->fresh()->load('rooms'),
        ]);
    }

    /**
     * Remove the specified hotel (Admin only).
     */
    public function destroy(Hotel $hotel): JsonResponse
    {
        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully.',
        ]);
    }
}