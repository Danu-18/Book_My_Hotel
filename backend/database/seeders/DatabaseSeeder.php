<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\Payment;
use App\Models\Promotion;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@bookmyhotel.com',
            'password' => 'password123',
            'role' => 'admin',
            'phone' => '+971500000001',
        ]);

        // Create hotel staff user
        $staff = User::create([
            'name' => 'Hotel Manager',
            'email' => 'staff@bookmyhotel.com',
            'password' => 'password123',
            'role' => 'staff',
            'phone' => '+971500000002',
        ]);

        // Create a sample customer
        $customer = User::create([
            'email' => 'customer@bookmyhotel.com',
            'password' => 'password123',
            'role' => 'customer',
            'phone' => '+971500000003',
        ]);

        $hotelData = [
            [
                'name' => 'Marriott Downtown Dubai',
                'chain' => 'Marriott',
                'location' => 'Sheikh Zayed Road',
                'city' => 'Dubai',
                'country' => 'UAE',
                'description' => 'Luxury five-star hotel in the heart of Dubai, offering stunning skyline views, multiple dining options, and world-class amenities.',
                'star_rating' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
                'amenities' => ['pool', 'spa', 'gym', 'restaurant', 'wifi', 'parking'],
                'latitude' => 25.2048,
                'longitude' => 55.2708,
            ],
            [
                'name' => 'Hilton Corniche Abu Dhabi',
                'chain' => 'Hilton',
                'location' => 'Corniche Road',
                'city' => 'Abu Dhabi',
                'country' => 'UAE',
                'description' => 'Elegant beachfront hotel on Abu Dhabi\'s famous Corniche, with private beach access and panoramic sea views.',
                'star_rating' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
                'amenities' => ['beach', 'pool', 'spa', 'wifi', 'restaurant', 'bar'],
                'latitude' => 24.4785,
                'longitude' => 54.3707,
            ],
            [
                'name' => 'Hyatt Regency Istanbul',
                'chain' => 'Hyatt',
                'location' => 'Taksim Square',
                'city' => 'Istanbul',
                'country' => 'Turkey',
                'description' => 'Sophisticated hotel overlooking the Bosphorus, combining modern luxury with rich cultural heritage.',
                'star_rating' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
                'amenities' => ['gym', 'restaurant', 'wifi', 'business_center', 'bar'],
                'latitude' => 41.0370,
                'longitude' => 28.9850,
            ],
            [
                'name' => 'Four Seasons London',
                'chain' => 'Four Seasons',
                'location' => 'Mayfair',
                'city' => 'London',
                'country' => 'UK',
                'description' => 'Iconic five-star hotel in Mayfair, offering refined elegance, Michelin-starred dining, and exceptional service.',
                'star_rating' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200',
                'amenities' => ['spa', 'gym', 'restaurant', 'wifi', 'concierge', 'bar'],
                'latitude' => 51.5074,
                'longitude' => -0.1406,
            ],
        ];

        foreach ($hotelData as $data) {
            $hotel = Hotel::create($data);

            // Create rooms for each hotel
            $roomTypes = [
                ['room_type' => 'Standard Room', 'price' => 450, 'amenities' => ['wifi', 'tv', 'air_conditioning']],
                ['room_type' => 'Deluxe Room', 'price' => 750, 'amenities' => ['wifi', 'tv', 'air_conditioning', 'minibar', 'city_view']],
                ['room_type' => 'Executive Suite', 'price' => 1200, 'amenities' => ['wifi', 'tv', 'air_conditioning', 'minibar', 'city_view', 'lounge_access']],
                ['room_type' => 'Royal Suite', 'price' => 2500, 'amenities' => ['wifi', 'tv', 'air_conditioning', 'minibar', 'panoramic_view', 'lounge_access', 'butler_service']],
            ];

            foreach ($roomTypes as $index => $roomType) {
                Room::create([
                    'hotel_id' => $hotel->id,
                    'room_type' => $roomType['room_type'],
                    'room_number' => $hotel->id.'-'.$index,
                    'capacity' => 2 + ($index % 2),
                    'price_per_night' => $roomType['price'],
                    'total_rooms' => 10,
                    'available_rooms' => 10 - $index,
                    'amenities' => $roomType['amenities'],
                    'image_url' => $hotel->image_url,
                    'is_active' => true,
                ]);
            }

            // Create promotions
            Promotion::create([
                'hotel_id' => $hotel->id,
                'title' => $hotel->chain.' Summer Special',
                'description' => 'Save 15% on summer bookings at '.$hotel->name,
                'discount_percentage' => 15,
                'start_date' => Carbon::now()->subDays(10)->toDateString(),
                'end_date' => Carbon::now()->addMonths(3)->toDateString(),
                'code' => strtoupper(Str::slug($hotel->chain)).'15',
                'is_active' => true,
            ]);

            // Create ancillary services
            $services = [
                ['name' => 'Breakfast Buffet', 'category' => 'dining', 'price' => 75, 'description' => 'Daily international breakfast buffet.'],
                ['name' => 'Airport Shuttle Service', 'category' => 'rental', 'price' => 150, 'description' => 'One-way private airport transfer.'],
                ['name' => 'City Sightseeing Tour', 'category' => 'tour', 'price' => 250, 'description' => 'Guided half-day city tour.'],
                ['name' => 'Full Body Massage', 'category' => 'spa', 'price' => 350, 'description' => '60-minute therapeutic massage at the luxury spa.'],
            ];

            foreach ($services as $service) {
                \App\Models\AncillaryService::create([
                    'hotel_id' => $hotel->id,
                    'name' => $service['name'],
                    'category' => $service['category'],
                    'price' => $service['price'],
                    'description' => $service['description'],
                    'is_active' => true,
                ]);
            }
        }

        // Create a confirmed reservation for the sample customer
        $room = Room::first();
        $reservation = Reservation::create([
            'user_id' => $customer->id,
            'room_id' => $room->id,
            'check_in_date' => Carbon::now()->addDays(7)->toDateString(),
            'check_out_date' => Carbon::now()->addDays(10)->toDateString(),
            'guests' => 2,
            'total_price' => $room->price_per_night * 3,
            'status' => 'confirmed',
            'special_requests' => 'Early check-in requested.',
        ]);

        Payment::create([
            'reservation_id' => $reservation->id,
            'user_id' => $customer->id,
            'stripe_payment_intent_id' => 'pi_test_'.Str::random(24),
            'amount' => $reservation->total_price,
            'status' => 'succeeded',
            'payment_method' => 'pm_card_visa',
        ]);

        // Create a review
        Review::create([
            'user_id' => $customer->id,
            'hotel_id' => $room->hotel_id,
            'rating' => 5,
            'comment' => 'Amazing stay! The room was spacious and clean, staff were incredibly helpful.',
        ]);
    }
}