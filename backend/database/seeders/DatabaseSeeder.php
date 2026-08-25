<?php

namespace Database\Seeders;

use App\Models\AncillaryService;
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
        // 1. Create the STRICTLY 4 hotels
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

        $hotels = [];
        foreach ($hotelData as $data) {
            $hotels[] = Hotel::create($data);
        }

        // 2. Create Users
        // Admin
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@bookmyhotel.com',
            'password' => 'password123',
            'role' => 'admin',
            'phone' => '+971500000001',
        ]);

        // 4 Staff users bound to the 4 hotels
        $staffs = [];
        $staffConfigs = [
            ['name' => 'Marriott Manager', 'email' => 'marriott@staff.com'],
            ['name' => 'Hilton Manager', 'email' => 'hilton@staff.com'],
            ['name' => 'Hyatt Manager', 'email' => 'hyatt@staff.com'],
            ['name' => 'Four Seasons Manager', 'email' => 'fourseasons@staff.com'],
        ];

        foreach ($staffConfigs as $i => $config) {
            $staffs[] = User::create([
                'name' => $config['name'],
                'email' => $config['email'],
                'password' => 'password123',
                'role' => 'staff',
                'phone' => '+97150000001' . $i,
                'hotel_id' => $hotels[$i]->id,
            ]);
        }

        // Keep legacy staff for backward compatibility
        User::create([
            'name' => 'Hotel Manager',
            'email' => 'staff@bookmyhotel.com',
            'password' => 'password123',
            'role' => 'staff',
            'phone' => '+971500000002',
            'hotel_id' => $hotels[0]->id,
        ]);

        // 6 standard Customers + 1 default customer
        $customers = [];
        $customers[] = User::create([
            'name' => 'John Customer',
            'email' => 'customer@bookmyhotel.com',
            'password' => 'password123',
            'role' => 'customer',
            'phone' => '+971500000003',
        ]);

        for ($c = 1; $c <= 6; $c++) {
            $customers[] = User::create([
                'name' => "Customer {$c}",
                'email' => "customer{$c}@test.com",
                'password' => 'password123',
                'role' => 'customer',
                'phone' => "+97150000000" . ($c + 3),
            ]);
        }

        // 3. Create Rooms (5 to 6 rooms distributed across hotels)
        // We will seed 5 distinct rooms per hotel for realistic choices.
        $rooms = [];
        foreach ($hotels as $hotel) {
            $roomTemplates = [
                ['type' => 'Standard Room', 'price' => 450, 'cap' => 2, 'rooms_count' => 10],
                ['type' => 'Deluxe Room', 'price' => 750, 'cap' => 2, 'rooms_count' => 10],
                ['type' => 'Executive Suite', 'price' => 1200, 'cap' => 3, 'rooms_count' => 5],
                ['type' => 'Royal Suite', 'price' => 2500, 'cap' => 4, 'rooms_count' => 2],
                ['type' => 'Family Suite', 'price' => 1500, 'cap' => 4, 'rooms_count' => 5],
            ];

            foreach ($roomTemplates as $index => $tpl) {
                $rooms[] = Room::create([
                    'hotel_id' => $hotel->id,
                    'room_type' => $tpl['type'],
                    'room_number' => $hotel->id . '-' . (100 + $index),
                    'capacity' => $tpl['cap'],
                    'price_per_night' => $tpl['price'],
                    'total_rooms' => $tpl['rooms_count'],
                    'available_rooms' => $tpl['rooms_count'] - 1,
                    'amenities' => ['wifi', 'tv', 'air_conditioning', 'city_view'],
                    'image_url' => $hotel->image_url,
                    'is_active' => true,
                ]);
            }
        }

        // 4. Create Promotions (6 active discount codes)
        $promotionsData = [
            ['title' => 'Marriott Summer Special', 'code' => 'MARRIOTT15', 'discount' => 15, 'hotel_idx' => 0],
            ['title' => 'Hilton Gateway Promo', 'code' => 'HILTON20', 'discount' => 20, 'hotel_idx' => 1],
            ['title' => 'Hyatt Elite Discount', 'code' => 'HYATT10', 'discount' => 10, 'hotel_idx' => 2],
            ['title' => 'Four Seasons Getaway', 'code' => 'FOURSEASONS25', 'discount' => 25, 'hotel_idx' => 3],
            ['title' => 'Global Launch Promotion', 'code' => 'GLOBAL15', 'discount' => 15, 'hotel_idx' => 0],
            ['title' => 'Exclusive Member Deal', 'code' => 'MEMBER20', 'discount' => 20, 'hotel_idx' => 1],
        ];

        foreach ($promotionsData as $promo) {
            Promotion::create([
                'hotel_id' => $hotels[$promo['hotel_idx']]->id,
                'title' => $promo['title'],
                'description' => "Enjoy a {$promo['discount']}% discount on luxury rooms.",
                'discount_percentage' => $promo['discount'],
                'start_date' => Carbon::now()->subDays(10)->toDateString(),
                'end_date' => Carbon::now()->addMonths(6)->toDateString(),
                'code' => $promo['code'],
                'is_active' => true,
            ]);
        }

        // 5. Create Ancillary Services (At least 6 services)
        $servicesTemplates = [
            ['name' => 'Breakfast Buffet', 'category' => 'dining', 'price' => 75, 'desc' => 'Daily international breakfast buffet.'],
            ['name' => 'Airport Shuttle', 'category' => 'rental', 'price' => 150, 'desc' => 'One-way private airport transfer.'],
            ['name' => 'City Tour', 'category' => 'tour', 'price' => 250, 'desc' => 'Guided half-day city sightseeing.'],
            ['name' => 'Full Body Massage', 'category' => 'spa', 'price' => 350, 'desc' => '60-minute therapeutic body massage.'],
            ['name' => 'VIP Lounge Access', 'category' => 'dining', 'price' => 200, 'desc' => 'Access to private lounge with drinks.'],
            ['name' => 'Guided Hiking Trip', 'category' => 'tour', 'price' => 180, 'desc' => 'Scenic guided nature excursion.'],
        ];

        foreach ($hotels as $hIdx => $hotel) {
            foreach ($servicesTemplates as $sIdx => $svc) {
                AncillaryService::create([
                    'hotel_id' => $hotel->id,
                    'name' => $svc['name'] . " - " . $hotel->chain,
                    'category' => $svc['category'],
                    'price' => $svc['price'],
                    'description' => $svc['desc'],
                    'is_active' => true,
                ]);
            }
        }

        // 6. Create exactly 6 Reservations
        // Customers indexes: 0 is John Customer, 1 to 6 are Customer 1-6.
        // Let's distribute reservations across various users and rooms.

        // 2x completed: dates strictly in the past
        $res1 = Reservation::create([
            'user_id' => $customers[1]->id,
            'room_id' => $rooms[0]->id, // Marriott standard room
            'check_in_date' => Carbon::now()->subDays(30)->toDateString(),
            'check_out_date' => Carbon::now()->subDays(27)->toDateString(),
            'guests' => 2,
            'total_price' => $rooms[0]->price_per_night * 3,
            'status' => 'completed',
            'special_requests' => 'Quiet room preferred.',
        ]);
        Payment::create([
            'reservation_id' => $res1->id,
            'user_id' => $customers[1]->id,
            'stripe_payment_intent_id' => 'pi_test_' . Str::random(24),
            'amount' => $res1->total_price,
            'status' => 'succeeded',
            'payment_method' => 'pm_card_visa',
        ]);

        $res2 = Reservation::create([
            'user_id' => $customers[2]->id,
            'room_id' => $rooms[5]->id, // Hilton standard room
            'check_in_date' => Carbon::now()->subDays(15)->toDateString(),
            'check_out_date' => Carbon::now()->subDays(12)->toDateString(),
            'guests' => 2,
            'total_price' => $rooms[5]->price_per_night * 3,
            'status' => 'completed',
            'special_requests' => 'Near elevator.',
        ]);
        Payment::create([
            'reservation_id' => $res2->id,
            'user_id' => $customers[2]->id,
            'stripe_payment_intent_id' => 'pi_test_' . Str::random(24),
            'amount' => $res2->total_price,
            'status' => 'succeeded',
            'payment_method' => 'pm_card_visa',
        ]);

        // 2x confirmed: dates in the future
        $res3 = Reservation::create([
            'user_id' => $customers[3]->id,
            'room_id' => $rooms[10]->id, // Hyatt room
            'check_in_date' => Carbon::now()->addDays(10)->toDateString(),
            'check_out_date' => Carbon::now()->addDays(14)->toDateString(),
            'guests' => 2,
            'total_price' => $rooms[10]->price_per_night * 4,
            'status' => 'confirmed',
            'special_requests' => 'Celebrating anniversary.',
        ]);
        Payment::create([
            'reservation_id' => $res3->id,
            'user_id' => $customers[3]->id,
            'stripe_payment_intent_id' => 'pi_test_' . Str::random(24),
            'amount' => $res3->total_price,
            'status' => 'succeeded',
            'payment_method' => 'pm_card_visa',
        ]);

        $res4 = Reservation::create([
            'user_id' => $customers[4]->id,
            'room_id' => $rooms[15]->id, // Four Seasons room
            'check_in_date' => Carbon::now()->addDays(20)->toDateString(),
            'check_out_date' => Carbon::now()->addDays(22)->toDateString(),
            'guests' => 3,
            'total_price' => $rooms[15]->price_per_night * 2,
            'status' => 'confirmed',
            'special_requests' => 'Extra pillows.',
        ]);
        Payment::create([
            'reservation_id' => $res4->id,
            'user_id' => $customers[4]->id,
            'stripe_payment_intent_id' => 'pi_test_' . Str::random(24),
            'amount' => $res4->total_price,
            'status' => 'succeeded',
            'payment_method' => 'pm_card_visa',
        ]);

        // 1x pending: dates in the future
        $res5 = Reservation::create([
            'user_id' => $customers[5]->id,
            'room_id' => $rooms[1]->id, // Marriott deluxe room
            'check_in_date' => Carbon::now()->addDays(30)->toDateString(),
            'check_out_date' => Carbon::now()->addDays(33)->toDateString(),
            'guests' => 2,
            'total_price' => $rooms[1]->price_per_night * 3,
            'status' => 'pending',
            'special_requests' => 'Late checkout option.',
        ]);

        // 1x cancelled
        $res6 = Reservation::create([
            'user_id' => $customers[6]->id,
            'room_id' => $rooms[6]->id, // Hilton deluxe room
            'check_in_date' => Carbon::now()->subDays(5)->toDateString(),
            'check_out_date' => Carbon::now()->subDays(3)->toDateString(),
            'guests' => 2,
            'total_price' => $rooms[6]->price_per_night * 2,
            'status' => 'cancelled',
            'special_requests' => 'Business trip cancellation.',
        ]);

        // 7. Create Reviews (linked to the completed reservations and their rooms/hotels)
        Review::create([
            'user_id' => $customers[1]->id,
            'hotel_id' => $rooms[0]->hotel_id,
            'room_id' => $rooms[0]->id,
            'rating' => 5,
            'comment' => 'Outstanding stay! The standard room at Marriott was beautiful and clean, and the location was ideal. Highly recommended!',
        ]);

        Review::create([
            'user_id' => $customers[2]->id,
            'hotel_id' => $rooms[5]->hotel_id,
            'room_id' => $rooms[5]->id,
            'rating' => 4,
            'comment' => 'Excellent service at Hilton. The beach access is gorgeous, but room service took slightly longer than expected.',
        ]);

        // Add additional dummy reviews on various rooms
        Review::create([
            'user_id' => $customers[3]->id,
            'hotel_id' => $rooms[1]->hotel_id,
            'room_id' => $rooms[1]->id,
            'rating' => 5,
            'comment' => 'The Marriott Deluxe Room was spacious with top-tier service. Highly recommended!',
        ]);

        Review::create([
            'user_id' => $customers[4]->id,
            'hotel_id' => $rooms[6]->hotel_id,
            'room_id' => $rooms[6]->id,
            'rating' => 5,
            'comment' => 'Absolutely loved the Hilton Deluxe Room. Perfect ocean view and beautiful decor.',
        ]);

        Review::create([
            'user_id' => $customers[5]->id,
            'hotel_id' => $rooms[11]->hotel_id,
            'room_id' => $rooms[11]->id,
            'rating' => 4,
            'comment' => 'The Hyatt Deluxe Room was great, the bed was super comfortable and the wifi was fast.',
        ]);

        Review::create([
            'user_id' => $customers[6]->id,
            'hotel_id' => $rooms[16]->hotel_id,
            'room_id' => $rooms[16]->id,
            'rating' => 5,
            'comment' => 'Four Seasons Deluxe Room was worth every penny. Impeccable luxury.',
        ]);
    }
}