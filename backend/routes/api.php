<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AncillaryServiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and assigned to the "api"
| middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public hotel & room browsing
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{hotel}', [HotelController::class, 'show']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

// Public promotions
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/promotions/validate', [PromotionController::class, 'validateCode']);
Route::get('/promotions/{promotion}', [PromotionController::class, 'show']);

// Public reviews
Route::get('/reviews', [ReviewController::class, 'index']);

// Public contact form
Route::post('/contact', [ContactController::class, 'store']);

// Public ancillary services
Route::get('/ancillary-services', [AncillaryServiceController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Reservations (customer)
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
    Route::post('/reservations/{reservation}/confirm', [ReservationController::class, 'confirm']);

    // Reviews (authenticated)
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Hotel Staff routes
    Route::middleware('role:staff')->group(function () {
        // Room management
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{room}', [RoomController::class, 'update']);

        // Promotions management
        Route::post('/promotions', [PromotionController::class, 'store']);
        Route::put('/promotions/{promotion}', [PromotionController::class, 'update']);
        Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy']);

        // View reservations by date
        Route::get('/staff/reservations/by-date', [ReservationController::class, 'byDate']);

        // Ancillary services management
        Route::post('/ancillary-services', [AncillaryServiceController::class, 'store']);
    });

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        // Hotel management
        Route::post('/hotels', [HotelController::class, 'store']);
        Route::put('/hotels/{hotel}', [HotelController::class, 'update']);
        Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy']);

        // Room management (full control)
        Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

        // Analytics dashboard
        Route::get('/admin/analytics', [AdminController::class, 'analytics']);

        // All reservations
        Route::get('/admin/reservations', [AdminController::class, 'allReservations']);

        // User management
        Route::get('/admin/users', [AdminController::class, 'users']);

        // Contact messages
        Route::get('/admin/contact-messages', [ContactController::class, 'index']);
        Route::post('/admin/contact-messages/{contactMessage}/read', [ContactController::class, 'markAsRead']);
    });
});