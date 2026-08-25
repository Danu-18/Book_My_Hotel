-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2026 at 09:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book_my_hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `ancillary_services`
--

CREATE TABLE `ancillary_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('dining','rental','tour','spa') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ancillary_services`
--

INSERT INTO `ancillary_services` (`id`, `hotel_id`, `name`, `category`, `price`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Breakfast Buffet - Marriott', 'dining', 75.00, 'Daily international breakfast buffet.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(2, 1, 'Airport Shuttle - Marriott', 'rental', 150.00, 'One-way private airport transfer.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(3, 1, 'City Tour - Marriott', 'tour', 250.00, 'Guided half-day city sightseeing.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(4, 1, 'Full Body Massage - Marriott', 'spa', 350.00, '60-minute therapeutic body massage.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(5, 1, 'VIP Lounge Access - Marriott', 'dining', 200.00, 'Access to private lounge with drinks.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(6, 1, 'Guided Hiking Trip - Marriott', 'tour', 180.00, 'Scenic guided nature excursion.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(7, 2, 'Breakfast Buffet - Hilton', 'dining', 75.00, 'Daily international breakfast buffet.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(8, 2, 'Airport Shuttle - Hilton', 'rental', 150.00, 'One-way private airport transfer.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(9, 2, 'City Tour - Hilton', 'tour', 250.00, 'Guided half-day city sightseeing.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(10, 2, 'Full Body Massage - Hilton', 'spa', 350.00, '60-minute therapeutic body massage.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(11, 2, 'VIP Lounge Access - Hilton', 'dining', 200.00, 'Access to private lounge with drinks.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(12, 2, 'Guided Hiking Trip - Hilton', 'tour', 180.00, 'Scenic guided nature excursion.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(13, 3, 'Breakfast Buffet - Hyatt', 'dining', 75.00, 'Daily international breakfast buffet.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(14, 3, 'Airport Shuttle - Hyatt', 'rental', 150.00, 'One-way private airport transfer.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(15, 3, 'City Tour - Hyatt', 'tour', 250.00, 'Guided half-day city sightseeing.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(16, 3, 'Full Body Massage - Hyatt', 'spa', 350.00, '60-minute therapeutic body massage.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(17, 3, 'VIP Lounge Access - Hyatt', 'dining', 200.00, 'Access to private lounge with drinks.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(18, 3, 'Guided Hiking Trip - Hyatt', 'tour', 180.00, 'Scenic guided nature excursion.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(19, 4, 'Breakfast Buffet - Four Seasons', 'dining', 75.00, 'Daily international breakfast buffet.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(20, 4, 'Airport Shuttle - Four Seasons', 'rental', 150.00, 'One-way private airport transfer.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(21, 4, 'City Tour - Four Seasons', 'tour', 250.00, 'Guided half-day city sightseeing.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(22, 4, 'Full Body Massage - Four Seasons', 'spa', 350.00, '60-minute therapeutic body massage.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(23, 4, 'VIP Lounge Access - Four Seasons', 'dining', 200.00, 'Access to private lounge with drinks.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(24, 4, 'Guided Hiking Trip - Four Seasons', 'tour', 180.00, 'Scenic guided nature excursion.', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `chain` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `star_rating` int(11) NOT NULL DEFAULT 5,
  `image_url` varchar(255) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `chain`, `location`, `city`, `country`, `description`, `star_rating`, `image_url`, `amenities`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 'Marriott Downtown Dubai', 'Marriott', 'Sheikh Zayed Road', 'Dubai', 'UAE', 'Luxury five-star hotel in the heart of Dubai, offering stunning skyline views, multiple dining options, and world-class amenities.', 5, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', '[\"pool\",\"spa\",\"gym\",\"restaurant\",\"wifi\",\"parking\"]', 25.2048000, 55.2708000, '2026-08-25 02:51:50', '2026-08-25 02:51:50'),
(2, 'Hilton Corniche Abu Dhabi', 'Hilton', 'Corniche Road', 'Abu Dhabi', 'UAE', 'Elegant beachfront hotel on Abu Dhabi\'s famous Corniche, with private beach access and panoramic sea views.', 5, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', '[\"beach\",\"pool\",\"spa\",\"wifi\",\"restaurant\",\"bar\"]', 24.4785000, 54.3707000, '2026-08-25 02:51:50', '2026-08-25 02:51:50'),
(3, 'Hyatt Regency Istanbul', 'Hyatt', 'Taksim Square', 'Istanbul', 'Turkey', 'Sophisticated hotel overlooking the Bosphorus, combining modern luxury with rich cultural heritage.', 5, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', '[\"gym\",\"restaurant\",\"wifi\",\"business_center\",\"bar\"]', 41.0370000, 28.9850000, '2026-08-25 02:51:50', '2026-08-25 02:51:50'),
(4, 'Four Seasons London', 'Four Seasons', 'Mayfair', 'London', 'UK', 'Iconic five-star hotel in Mayfair, offering refined elegance, Michelin-starred dining, and exceptional service.', 5, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', '[\"spa\",\"gym\",\"restaurant\",\"wifi\",\"concierge\",\"bar\"]', 51.5074000, -0.1406000, '2026-08-25 02:51:50', '2026-08-25 02:51:50');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_14_181906_create_personal_access_tokens_table', 1),
(5, '2026_08_14_182000_create_hotels_table', 1),
(6, '2026_08_14_182100_create_rooms_table', 1),
(7, '2026_08_14_182200_create_reservations_table', 1),
(8, '2026_08_14_182300_create_payments_table', 1),
(9, '2026_08_14_182400_create_promotions_table', 1),
(10, '2026_08_14_182500_create_reviews_table', 1),
(11, '2026_08_14_182600_create_contact_messages_table', 1),
(12, '2026_08_21_123000_change_rooms_uniqueness_constraint', 1),
(13, '2026_08_21_125000_create_ancillary_services_table', 1),
(14, '2026_08_21_125100_create_reservation_ancillary_service_table', 1),
(15, '2026_08_24_160800_add_hotel_id_to_users_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reservation_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `stripe_payment_intent_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'AED',
  `status` enum('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `reservation_id`, `user_id`, `stripe_payment_intent_id`, `amount`, `currency`, `status`, `payment_method`, `created_at`, `updated_at`) VALUES
(1, 1, 8, 'pi_test_GY4cTtXwfkQzdAZLHHC4tZM4', 1350.00, 'AED', 'succeeded', 'pm_card_visa', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(2, 2, 9, 'pi_test_YBazk0UByXY3gB8Qdml1cD43', 1350.00, 'AED', 'succeeded', 'pm_card_visa', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(3, 3, 10, 'pi_test_63AUdJdSdWKNHwjYMC5IMKLr', 1800.00, 'AED', 'succeeded', 'pm_card_visa', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(4, 4, 11, 'pi_test_at4AAZQIBXBJG14Otf1vU32D', 900.00, 'AED', 'succeeded', 'pm_card_visa', '2026-08-25 02:51:54', '2026-08-25 02:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 14, 'auth_token', 'ee543f7eea58872367738ff17d26fb3b067633f2ca09f2fa5dd3cbcfa2124c39', '[\"*\"]', '2026-08-25 02:55:18', NULL, '2026-08-25 02:55:16', '2026-08-25 02:55:18');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `hotel_id`, `title`, `description`, `discount_percentage`, `start_date`, `end_date`, `code`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Marriott Summer Special', 'Enjoy a 15% discount on luxury rooms.', 15.00, '2026-08-15', '2027-02-25', 'MARRIOTT15', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(2, 2, 'Hilton Gateway Promo', 'Enjoy a 20% discount on luxury rooms.', 20.00, '2026-08-15', '2027-02-25', 'HILTON20', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(3, 3, 'Hyatt Elite Discount', 'Enjoy a 10% discount on luxury rooms.', 10.00, '2026-08-15', '2027-02-25', 'HYATT10', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(4, 4, 'Four Seasons Getaway', 'Enjoy a 25% discount on luxury rooms.', 25.00, '2026-08-15', '2027-02-25', 'FOURSEASONS25', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(5, 1, 'Global Launch Promotion', 'Enjoy a 15% discount on luxury rooms.', 15.00, '2026-08-15', '2027-02-25', 'GLOBAL15', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(6, 2, 'Exclusive Member Deal', 'Enjoy a 20% discount on luxury rooms.', 20.00, '2026-08-15', '2027-02-25', 'MEMBER20', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `guests` int(11) NOT NULL DEFAULT 1,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `room_id`, `check_in_date`, `check_out_date`, `guests`, `total_price`, `status`, `special_requests`, `created_at`, `updated_at`) VALUES
(1, 8, 1, '2026-07-26', '2026-07-29', 2, 1350.00, 'completed', 'Quiet room preferred.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(2, 9, 6, '2026-08-10', '2026-08-13', 2, 1350.00, 'completed', 'Near elevator.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(3, 10, 11, '2026-09-04', '2026-09-08', 2, 1800.00, 'confirmed', 'Celebrating anniversary.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(4, 11, 16, '2026-09-14', '2026-09-16', 3, 900.00, 'confirmed', 'Extra pillows.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(5, 12, 2, '2026-09-24', '2026-09-27', 2, 2250.00, 'pending', 'Late checkout option.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(6, 13, 7, '2026-08-20', '2026-08-22', 2, 1500.00, 'cancelled', 'Business trip cancellation.', '2026-08-25 02:51:54', '2026-08-25 02:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `reservation_ancillary_service`
--

CREATE TABLE `reservation_ancillary_service` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reservation_id` bigint(20) UNSIGNED NOT NULL,
  `ancillary_service_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_at_booking` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `hotel_id`, `room_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 1, 5, 'Outstanding stay! The standard room at Marriott was beautiful and clean, and the location was ideal. Highly recommended!', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(2, 9, 2, 6, 4, 'Excellent service at Hilton. The beach access is gorgeous, but room service took slightly longer than expected.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(3, 10, 1, 2, 5, 'The Marriott Deluxe Room was spacious with top-tier service. Highly recommended!', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(4, 11, 2, 7, 5, 'Absolutely loved the Hilton Deluxe Room. Perfect ocean view and beautiful decor.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(5, 12, 3, 12, 4, 'The Hyatt Deluxe Room was great, the bed was super comfortable and the wifi was fast.', '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(6, 13, 4, 17, 5, 'Four Seasons Deluxe Room was worth every penny. Impeccable luxury.', '2026-08-25 02:51:54', '2026-08-25 02:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 2,
  `price_per_night` decimal(10,2) NOT NULL,
  `total_rooms` int(11) NOT NULL DEFAULT 1,
  `available_rooms` int(11) NOT NULL DEFAULT 1,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `hotel_id`, `room_type`, `room_number`, `capacity`, `price_per_night`, `total_rooms`, `available_rooms`, `amenities`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Standard Room', '1-100', 2, 450.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(2, 1, 'Deluxe Room', '1-101', 2, 750.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(3, 1, 'Executive Suite', '1-102', 3, 1200.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(4, 1, 'Royal Suite', '1-103', 4, 2500.00, 2, 1, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(5, 1, 'Family Suite', '1-104', 4, 1500.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(6, 2, 'Standard Room', '2-100', 2, 450.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(7, 2, 'Deluxe Room', '2-101', 2, 750.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(8, 2, 'Executive Suite', '2-102', 3, 1200.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(9, 2, 'Royal Suite', '2-103', 4, 2500.00, 2, 1, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(10, 2, 'Family Suite', '2-104', 4, 1500.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(11, 3, 'Standard Room', '3-100', 2, 450.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(12, 3, 'Deluxe Room', '3-101', 2, 750.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(13, 3, 'Executive Suite', '3-102', 3, 1200.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(14, 3, 'Royal Suite', '3-103', 4, 2500.00, 2, 1, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(15, 3, 'Family Suite', '3-104', 4, 1500.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(16, 4, 'Standard Room', '4-100', 2, 450.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(17, 4, 'Deluxe Room', '4-101', 2, 750.00, 10, 9, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(18, 4, 'Executive Suite', '4-102', 3, 1200.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(19, 4, 'Royal Suite', '4-103', 4, 2500.00, 2, 1, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54'),
(20, 4, 'Family Suite', '4-104', 4, 1500.00, 5, 4, '[\"wifi\",\"tv\",\"air_conditioning\",\"city_view\"]', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', 1, '2026-08-25 02:51:54', '2026-08-25 02:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('1ynwBM3HxaeeFSA8Y5yhacScxbnOoX8i0PTHN8q6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUEpXTGtNVU5xMmZST041NEJSTU1EU1NFZDFuelVoVmU0TUJwdGxpaSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644505),
('2gMss0MaeWqqESYwnozEXI9XnFB0N4jBgs0hZsKm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkxmeUxnTWppSHpsQzdXUjdhTTV4SFNORW1FSUNxR1dnUkRncndXYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644500),
('36jmdwVq7W9JzIzkyHxW8IRTNxvtDCEQMnIXN7TT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVm5vWEZydkFUY1JaVGo4MmZQUlFUdlIzenpaTWU1ZkN5RUhNaTJ6UyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644499),
('3aO7gTqoO4vsqgQVr0aUcflCHchaDz3UoN8svWNr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTGtmWElwV0RhRU5vUDE3eTRCN0J6MHN2UEJsR3J6OXBkVGcyNzRueSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644402),
('5n6HCEiTJWYPoCdCtiOnKSsZOmnhMgERSBHaAJaq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoienA5YUwzUGtKN3cwT2M5N2pzdVVyWm9ZbTlJaHhDM1lad2tDaVNLMiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644380),
('5PgspGyFVcT8r78r8AOrR2XB5z1yKBhq1OC5TpPE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVVJ0RG9sOXFIUk94dTFaV0pwVzBabGRuS1Jrc2lhU2NqODBOaUs3NSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644512),
('A4PoUDMuTmS9Mitd5ZMKyWekrBf0XHo9ykTXn8ro', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWmJSSDIxNVVYdWswM2lmMVpXT01xVDUzVmxTeVNHQmdlNW5CTkE3SSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644374),
('aWh7nE7DY62OUtKAM9sDTFVANjw6n8VjKX6Taf4l', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHBBdjl2V1BVUjYzMGVEVXhacGJGZE1CbjFnTWdNd28yaTQzdzFhaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644517),
('AWULCMdZYcunUzcCgiWrZ8Lu2xRwqilh92lzocFM', 14, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRElKN0tWNWdLMzIzZDNPc0RvaTdnUXVId2czZnNLWHEyN3daREd4WiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTQ7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644516),
('BhWO1rCdtb4JKFJ1i362Do7cCds3bfqiXf0137qH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFlsWmZwTDZDZHhKanZkVHNNVUN0SU9VQ1YxcWpaelFLZWpERlhtMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644501),
('EA1FcCOV0MyALfhvZT2ZHddFujOqbHdEAISOse6i', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU1dkMjFlZkxwWmV0U3dNZ2wyaWthdDZ3N3Zpak1tbXJCejJlekNRTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644402),
('fwURZmTQp4uSubgciQgzTqWXsQexBSTTl8sfhBht', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicjJaZ25KdlVoS3R0Qjd3SnVaZ29Ya0NtdFZxSWJraE5oS3F4OGhNTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644375),
('Gu6lXPn0IYvqXNQ5BiMrBDBXXGHFF41962zbsabO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmZxVjRmU29ZbGZrNUhoODF5V2FMZmJFUW1NOWxSMUVWNzNwbWdVNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644375),
('HnkHdmYuEgS3K6WCQSgjLBUNK6Rakc7xAE3fUDSi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFJJSWZwbGtJUmlKU1VmMTR0M2RPYzJodExnWTh3dU0yUG9VcWdFRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644517),
('jSVFJu7yJ2SwE047Mzte4nDbO84qNS6HtjRo1qso', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHB4emIyUEpJdDUxalMxTGkwNFluODRRcExVa1BBRFpVRGpzZ29WRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644499),
('Klvqz4Jeahzo7Peb97HgMJM9mS0P0y9SkktnLNk2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejZONVd2Zk1NdWgxQ01SSjJaaDdzT2VSRldYTThSZXZaeFQyOFdaaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644518),
('nChvSrmakafO1Vaq2WfEEFa7fA0XK9Ndi2QI2XAV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmxIOWRYTGM2V0ZWcGN1dURBSEhSTzNrbGo2UGJTbkpCWlFWbzZuYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644402),
('oS7ff3x7YH9Qbz7N9TLBQhJUA8Y0ndyHh42V9hq2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZW5VVlgxYzNZTWZ3UEh2ODdFUGd5TkNwR0FNb2hCZ3hDaUZ4aDlCTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644375),
('SDsEKByy4PVf4aQRFFM6aJfP2VFcPoCsArthTp5b', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVXF6U2RDOVhkZjJRQjRUWFhad3FqVm1NVFQ1d1hkUDVFWWZab29aOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvaG90ZWxzP3Blcl9wYWdlPTgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787644375),
('sSxemzZOdbMeqg4fbBB8DTpE0Dz5CKSH1yh3J8hf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlBtb0JUYUtSWm1MeUE4T09IWEllSHlQNzRZWUk3a1RSTm4yZll3ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644518),
('TgcJ5CNDaWvaoIZW1we3XGSppVEbpIzNceHDjsOa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2QzNGM3WXBFb3pHQ210U2NLR08zQlptNzBsTFRja1dnejBHc205dCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644501),
('vDmP8tyZvE6AZFhIpF4WPqt03Cb0YStppTMdgDTL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzRlWFFidFJMdG5rN1lIbjJFSXlia2Z0em1FZ1dCd2dEdXQ0cU0wSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644402),
('VnLXwOMUzMhwpldaUK8M9HZptWjFJvg7ier5xLnX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFVKbFg5OTRFdHVocFFiYVlINVB4dFJ2cXBVYTVJRzA4R3ZQNVhObyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644500),
('wjXJczdWNkPOp6kMtnvYCP0XT2LCtIG6653MwptJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMkFoWXM2RFpVS3NHb0R0S0JCNGdmSGdXY3lxYzRwdjBtUTNnWFhicCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644385),
('Z6l6YPJu78IP9YTsb9fBY2tj837PhMbtnbAAiR3x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0hlSFVtS29wamswelVjUTB2T2pkRkVIaHVVUlZDZ1BhcEFFWjJJMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJvbW90aW9ucyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644499),
('ZrlkNZynzIh829ka6pVK73wtoaw2QwGqJq094F5D', 14, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieXVMRDl1OWcwd3NaZHB3QmZwWkJxNTQ5bzVTUUdhaHo3UkMyaEo2ciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644498),
('zUM1U7IHBHf2TraVL9UP8h6wAWaI2h6KfSFrneF9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTXVJcWI3T1h6RlMxZjJOY045NGtFR0l6RUh2OWxOSHQ1QzNCVklxZiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787644401);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','staff','admin') NOT NULL DEFAULT 'customer',
  `phone` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `hotel_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `phone`, `remember_token`, `created_at`, `updated_at`, `hotel_id`) VALUES
(1, 'System Admin', 'admin@bookmyhotel.com', NULL, '$2y$12$MzynYX.bZY0kOJB0dDyv.OmS68ZZNuFDBAWSOuEVsGOX5e9RxniSC', 'admin', '+971500000001', NULL, '2026-08-25 02:51:51', '2026-08-25 02:51:51', NULL),
(2, 'Marriott Manager', 'marriott@staff.com', NULL, '$2y$12$jGY2KJkt.XcJMvkVlqDgteaHI6QUKt1t7Xc377ZIiCLHQr5zVpFP2', 'staff', '+971500000010', NULL, '2026-08-25 02:51:51', '2026-08-25 02:51:51', 1),
(3, 'Hilton Manager', 'hilton@staff.com', NULL, '$2y$12$ZuKsitNqXonGCqO5QMVoreXje59hff9uqhJAdux3.x1rVlY7NXj6W', 'staff', '+971500000011', NULL, '2026-08-25 02:51:51', '2026-08-25 02:51:51', 2),
(4, 'Hyatt Manager', 'hyatt@staff.com', NULL, '$2y$12$KobzR1GN93aDIZJMZ57QHOJQpIregTXnF4U9OTBQeoHN2BTKReycy', 'staff', '+971500000012', NULL, '2026-08-25 02:51:51', '2026-08-25 02:51:51', 3),
(5, 'Four Seasons Manager', 'fourseasons@staff.com', NULL, '$2y$12$4q57ahaP/XAuBrMal9eqk.TYVVpuEiRBB1Y6DMYvmNtIWgbaYRuB6', 'staff', '+971500000013', NULL, '2026-08-25 02:51:52', '2026-08-25 02:51:52', 4),
(6, 'Hotel Manager', 'staff@bookmyhotel.com', NULL, '$2y$12$sMEHWyTEWt9uD5Ww5qgl3.h/Ormj0ay/vYW6H6wj6Uv.npExts.jO', 'staff', '+971500000002', NULL, '2026-08-25 02:51:52', '2026-08-25 02:51:52', 1),
(7, 'John Customer', 'customer@bookmyhotel.com', NULL, '$2y$12$XsH2RVjUjAgaOLIwidCb5eUBRvwvtjgM0NXxQCT8nBbaSVO1eJ2Va', 'customer', '+971500000003', NULL, '2026-08-25 02:51:52', '2026-08-25 02:51:52', NULL),
(8, 'Customer 1', 'customer1@test.com', NULL, '$2y$12$/NAGZNrnEeUX0R.1htgIUubzj2x76gU0CxZe8e3h.ywcbslohm7fa', 'customer', '+971500000004', NULL, '2026-08-25 02:51:52', '2026-08-25 02:51:52', NULL),
(9, 'Customer 2', 'customer2@test.com', NULL, '$2y$12$89m9ncLrASVU/v5XId7PBOZlKO0ZpkJA.tS6HuNbRx65qX5OTGcmm', 'customer', '+971500000005', NULL, '2026-08-25 02:51:53', '2026-08-25 02:51:53', NULL),
(10, 'Customer 3', 'customer3@test.com', NULL, '$2y$12$rnzmhfDISqkFxVVBgvrlPeKrnznbqH5MXQ91At0OdrMFYLB4Q9I4O', 'customer', '+971500000006', NULL, '2026-08-25 02:51:53', '2026-08-25 02:51:53', NULL),
(11, 'Customer 4', 'customer4@test.com', NULL, '$2y$12$4jlqUuSALeSBVl4UFpJ12.fJitJWB3kHTNGyFh5PaGl9ZwKwTeJEO', 'customer', '+971500000007', NULL, '2026-08-25 02:51:53', '2026-08-25 02:51:53', NULL),
(12, 'Customer 5', 'customer5@test.com', NULL, '$2y$12$ufaiFGnm.WnYMQmM1dkkwOLkgo/nef/pB3vhg5G8QCE0s7TGE715C', 'customer', '+971500000008', NULL, '2026-08-25 02:51:53', '2026-08-25 02:51:53', NULL),
(13, 'Customer 6', 'customer6@test.com', NULL, '$2y$12$vw6OVxqYQzAk/3RHbs.qHOF3ivHPvXmvZDrfd4FxN6N7G/sfL16oe', 'customer', '+971500000009', NULL, '2026-08-25 02:51:54', '2026-08-25 02:51:54', NULL),
(14, 'Danial Arif', 'daniyalarif2004@gmail.com', NULL, '$2y$12$865uhRaHuBtov9sgi/Pwau5bcJCdL24TwPMY4/pN6S7ew7IC/.I5a', 'customer', '03080408601', NULL, '2026-08-25 02:53:21', '2026-08-25 02:53:21', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ancillary_services`
--
ALTER TABLE `ancillary_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ancillary_services_hotel_id_foreign` (`hotel_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_stripe_payment_intent_id_unique` (`stripe_payment_intent_id`),
  ADD KEY `payments_reservation_id_foreign` (`reservation_id`),
  ADD KEY `payments_user_id_foreign` (`user_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promotions_code_unique` (`code`),
  ADD KEY `promotions_hotel_id_foreign` (`hotel_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservations_user_id_foreign` (`user_id`),
  ADD KEY `reservations_room_id_foreign` (`room_id`);

--
-- Indexes for table `reservation_ancillary_service`
--
ALTER TABLE `reservation_ancillary_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservation_ancillary_service_reservation_id_foreign` (`reservation_id`),
  ADD KEY `reservation_ancillary_service_ancillary_service_id_foreign` (`ancillary_service_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`),
  ADD KEY `reviews_hotel_id_foreign` (`hotel_id`),
  ADD KEY `reviews_room_id_foreign` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rooms_hotel_id_room_number_unique` (`hotel_id`,`room_number`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_hotel_id_foreign` (`hotel_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ancillary_services`
--
ALTER TABLE `ancillary_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservation_ancillary_service`
--
ALTER TABLE `reservation_ancillary_service`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ancillary_services`
--
ALTER TABLE `ancillary_services`
  ADD CONSTRAINT `ancillary_services_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_reservation_id_foreign` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promotions`
--
ALTER TABLE `promotions`
  ADD CONSTRAINT `promotions_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservation_ancillary_service`
--
ALTER TABLE `reservation_ancillary_service`
  ADD CONSTRAINT `reservation_ancillary_service_ancillary_service_id_foreign` FOREIGN KEY (`ancillary_service_id`) REFERENCES `ancillary_services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservation_ancillary_service_reservation_id_foreign` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
