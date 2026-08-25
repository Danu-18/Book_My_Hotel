<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    /**
     * Display a listing of active promotions.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Promotion::with('hotel');

        // Enforce strict data isolation for staff
        $user = $request->user('sanctum');
        if ($user && ($user->role === 'staff' || $user->role === 'admin')) {
            if ($user->role === 'staff') {
                $query->where('hotel_id', $user->hotel_id);
            } else {
                // Admin can filter by hotel if query param is passed
                if ($request->has('hotel_id')) {
                    $query->where('hotel_id', $request->input('hotel_id'));
                }
            }
        } else {
            $query->where('is_active', true);

            // Filter by hotel
            if ($request->has('hotel_id')) {
                $query->where('hotel_id', $request->input('hotel_id'));
            }

            // Only show currently valid promotions
            $today = Carbon::today()->toDateString();
            $query->where('start_date', '<=', $today)
                ->where('end_date', '>=', $today);
        }

        $promotions = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['promotions' => $promotions]);
    }

    /**
     * Store a newly created promotion (Hotel Staff/Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'code' => ['nullable', 'string', 'max:50', 'unique:promotions'],
            'is_active' => ['boolean'],
        ];

        if ($request->user()->role === 'admin') {
            $rules['hotel_id'] = ['required', 'exists:hotels,id'];
        }

        $validated = $request->validate($rules);

        if ($request->user()->role === 'staff') {
            $validated['hotel_id'] = $request->user()->hotel_id;
        }

        $promotion = Promotion::create($validated);

        return response()->json([
            'message' => 'Promotion created successfully.',
            'promotion' => $promotion->load('hotel'),
        ], 201);
    }

    /**
     * Display the specified promotion.
     */
    public function show(Promotion $promotion): JsonResponse
    {
        return response()->json([
            'promotion' => $promotion->load('hotel'),
        ]);
    }

    /**
     * Update the specified promotion (Hotel Staff/Admin).
     */
    public function update(Request $request, Promotion $promotion): JsonResponse
    {
        if ($request->user()->role === 'staff' && $promotion->hotel_id !== $request->user()->hotel_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $rules = [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_percentage' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after:start_date'],
            'code' => ['sometimes', 'string', 'max:50', 'unique:promotions,code,'.$promotion->id],
            'is_active' => ['boolean'],
        ];

        if ($request->user()->role === 'admin') {
            $rules['hotel_id'] = ['sometimes', 'exists:hotels,id'];
        }

        $validated = $request->validate($rules);

        if ($request->user()->role === 'staff') {
            $validated['hotel_id'] = $request->user()->hotel_id;
        }

        $promotion->update($validated);

        return response()->json([
            'message' => 'Promotion updated successfully.',
            'promotion' => $promotion->fresh()->load('hotel'),
        ]);
    }

    /**
     * Remove the specified promotion (Admin only / Staff bound to hotel).
     */
    public function destroy(Request $request, Promotion $promotion): JsonResponse
    {
        if ($request->user()->role === 'staff' && $promotion->hotel_id !== $request->user()->hotel_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $promotion->delete();

        return response()->json([
            'message' => 'Promotion deleted successfully.',
        ]);
    }

    /**
     * Validate a promo code for a given hotel (Public/Customer).
     */
    public function validateCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
            'hotel_id' => ['required', 'exists:hotels,id'],
        ]);

        $code = $request->input('code');
        $hotelId = $request->input('hotel_id');

        $promotion = Promotion::with('hotel')
            ->where('code', $code)
            ->where('hotel_id', $hotelId)
            ->first();

        if (!$promotion) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Invalid promo code.'
            ]);
        }

        if (!$promotion->is_active) {
            return response()->json([
                'status' => 'inactive',
                'message' => 'Promo code is inactive.'
            ]);
        }

        // Resolve timezone based on the hotel city
        $timezone = 'UTC';
        if ($promotion->hotel) {
            $city = strtolower($promotion->hotel->city);
            if ($city === 'dubai' || $city === 'abu dhabi') {
                $timezone = 'Asia/Dubai';
            } elseif ($city === 'istanbul') {
                $timezone = 'Europe/Istanbul';
            } elseif ($city === 'london') {
                $timezone = 'Europe/London';
            }
        }

        $today = Carbon::today($timezone)->toDateString();
        $startDateStr = $promotion->start_date->toDateString();
        $endDateStr = $promotion->end_date->toDateString();

        if ($startDateStr > $today) {
            return response()->json([
                'status' => 'not_started',
                'message' => 'Promo code is not active yet.'
            ]);
        }

        if ($endDateStr < $today) {
            return response()->json([
                'status' => 'expired',
                'message' => 'Promo code has expired.'
            ]);
        }

        return response()->json([
            'status' => 'valid',
            'promotion' => $promotion
        ]);
    }
}