<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'hotel_id',
        'room_type',
        'room_number',
        'capacity',
        'price_per_night',
        'total_rooms',
        'available_rooms',
        'amenities',
        'image_url',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amenities' => 'array',
            'capacity' => 'integer',
            'total_rooms' => 'integer',
            'available_rooms' => 'integer',
            'price_per_night' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the hotel that owns the room.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * Get the reservations for the room.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}