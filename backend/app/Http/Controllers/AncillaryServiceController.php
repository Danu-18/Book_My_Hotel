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

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->input('hotel_id'));
        }

        $services = $query->orderBy('name')->get();

        return response()->json(['ancillary_services' => $services]);
    }

    /**
     * Store a newly created ancillary service.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => ['required', 'exists:hotels,id'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:dining,rental,tour,spa'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $service = AncillaryService::create($validated);

        return response()->json([
            'message' => 'Ancillary service created successfully.',
            'ancillary_service' => $service,
        ], 201);
    }
}
