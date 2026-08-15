"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">BookMyHotel</span>
              <span className="text-xs text-gray-500 hidden sm:inline">.com</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/hotels" className="text-gray-700 hover:text-blue-600 font-medium">
              Hotels
            </Link>
            <Link href="/promotions" className="text-gray-700 hover:text-blue-600 font-medium">
              Deals
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
            {user && (
              <>
                <Link href="/reservations" className="text-gray-700 hover:text-blue-600 font-medium">
                  My Bookings
                </Link>
                {(user.role === "admin" || user.role === "staff") && (
                  <>
                    <Link href={user.role === "admin" ? "/admin" : "/staff"} className="text-gray-700 hover:text-blue-600 font-medium">
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block text-sm text-gray-600">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3 flex flex-col space-y-2">
          <Link href="/hotels" className="text-gray-700 hover:text-blue-600 font-medium">
            Hotels
          </Link>
          <Link href="/promotions" className="text-gray-700 hover:text-blue-600 font-medium">
            Deals
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </Link>
          {user && (
            <>
              <Link href="/reservations" className="text-gray-700 hover:text-blue-600 font-medium">
                My Bookings
              </Link>
              {(user.role === "admin" || user.role === "staff") && (
                <Link href={user.role === "admin" ? "/admin" : "/staff"} className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}