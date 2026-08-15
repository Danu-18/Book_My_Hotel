<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Store a new contact message (public).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contactMessage = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Your message has been sent successfully.',
            'contact_message' => $contactMessage,
        ], 201);
    }

    /**
     * Display a listing of contact messages (Admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        $messages = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($messages);
    }

    /**
     * Mark a contact message as read (Admin only).
     */
    public function markAsRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['is_read' => true]);

        return response()->json([
            'message' => 'Message marked as read.',
            'contact_message' => $contactMessage,
        ]);
    }
}