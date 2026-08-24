export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  phone: string | null;
  hotel_id?: number | null;
  created_at: string;
}

export interface Hotel {
  id: number;
  name: string;
  chain: string;
  location: string;
  city: string;
  country: string;
  description: string;
  star_rating: number;
  image_url: string | null;
  amenities: string[] | null;
  rooms_count?: number;
  rooms?: Room[];
}

export interface Room {
  id: number;
  hotel_id: number;
  room_type: string;
  room_number: string;
  capacity: number;
  price_per_night: string;
  total_rooms: number;
  available_rooms: number;
  remaining_rooms?: number;
  amenities: string[] | null;
  image_url: string | null;
  is_active: boolean;
  hotel?: Hotel;
}

export interface Reservation {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  special_requests: string | null;
  room?: Room;
  payment?: Payment;
  user?: User;
}

export interface Payment {
  id: number;
  reservation_id: number;
  stripe_payment_intent_id: string;
  amount: string;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
}

export interface Promotion {
  id: number;
  hotel_id: number;
  title: string;
  description: string;
  discount_percentage: string;
  start_date: string;
  end_date: string;
  code: string;
  is_active: boolean;
  hotel?: Hotel;
}

export interface Review {
  id: number;
  user_id: number;
  hotel_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: User;
}

export interface AnalyticsData {
  summary: {
    room_nights: number;
    room_revenue: number;
    average_daily_rate: number;
    total_reservations: number;
  };
  by_hotel: Array<{
    hotel: string;
    chain: string;
    room_nights: number;
  }>;
  date_range: {
    start: string;
    end: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}