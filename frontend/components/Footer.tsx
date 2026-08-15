import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white">BookMyHotel<span className="text-blue-400">.com</span></h3>
            <p className="mt-4 text-sm leading-6">
              Your single platform for luxury hotel reservations across Marriott,
              Hilton, Hyatt, and Four Seasons. Best price guarantee with secure payments.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} BookMyHotel.com. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link></li>
              <li><Link href="/promotions" className="hover:text-white transition-colors">Deals & Promotions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Account</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/reservations" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}