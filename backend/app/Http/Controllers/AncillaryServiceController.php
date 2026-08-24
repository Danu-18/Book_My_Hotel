<?php

namespace App\Http\Controllers;

use App\Models\AncillaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AncillaryServiceController extends Controller
{
    /**
     * Display a listing of ancillary services, optionally filtered by hotel_id.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AncillaryService::query()->where('is_active', true);

        // Enforce strict data isolation for staff
        $user = $request->user('sanctum');
        if ($user && $user->role === 'staff') {
            $query->where('hotel_id', $user->hotel_id);
        } else {
            if ($request->has('hotel_id')) {
                $query->where('hotel_id', $request->input('hotel_id'));
            }
        }

        $services = $query->orderBy('name')->get();

        return response()->json(['ancillary_services' => $services]);
    }

    /**
     * Store a newly created ancillary service.
     */
    public function store(Request $request): JsonResponse
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:dining,rental,tour,spa'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];

        if ($request->user()->role === 'admin') {
            $rules['hotel_id'] = ['required', 'exists:hotels,id'];
        }

        $validated = $request->validate($rules);

        if ($request->user()->role === 'staff') {
            $validated['hotel_id'] = $request->user()->hotel_id;
        }

        $service = AncillaryService::create($validated);

        return response()->json([
            'message' => 'Ancillary service created successfully.',
            'ancillary_service' => $service,
        ], 201);
    }

    /**
     * Update the specified ancillary service.
     */
    public function update(Request $request, AncillaryService $service): JsonResponse
    {
        if ($request->user()->role === 'staff' && $service->hotel_id !== $request->user()->hotel_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $rules = [
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'in:dining,rental,tour,spa'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];

        if ($request->user()->role === 'admin') {
            $rules['hotel_id'] = ['sometimes', 'exists:hotels,id'];
        }

        $validated = $request->validate($rules);

        if ($request->user()->role === 'staff') {
            $validated['hotel_id'] = $request->user()->hotel_id;
        }

        $service->update($validated);

        return response()->json([
            'message' => 'Ancillary service updated successfully.',
            'ancillary_service' => $service->fresh(),
        ]);
    }

    /**
     * Remove the specified ancillary service.
     */
    public function destroy(Request $request, AncillaryService $service): JsonResponse
    {
        if ($request->user()->role === 'staff' && $service->hotel_id !== $request->user()->hotel_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $service->delete();

        return response()->json([
            'message' => 'Ancillary service deleted successfully.',
        ]);
    }
}
