<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->string('room_type'); // Standard, Deluxe, Suite, etc.
            $table->string('room_number')->unique();
            $table->integer('capacity')->default(2);
            $table->decimal('price_per_night', 10, 2);
            $table->integer('total_rooms')->default(1);
            $table->integer('available_rooms')->default(1);
            $table->json('amenities')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};