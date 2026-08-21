"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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

          {/* Desktop Navigation Links */}
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
                  <Link href={user.role === "admin" ? "/admin" : "/staff"} className="text-gray-700 hover:text-blue-600 font-medium">
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Auth Buttons / Mobile Hamburger Trigger */}
          <div className="flex items-center space-x-4">
            {/* Desktop-only Auth controls */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
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

            {/* Hamburger Button (visible on mobile only) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col space-y-2 border-t border-gray-100">
            <Link
              href="/hotels"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hotels
            </Link>
            <Link
              href="/promotions"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              Contact
            </Link>
            {user && (
              <>
                <Link
                  href="/reservations"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                >
                  My Bookings
                </Link>
                {(user.role === "admin" || user.role === "staff") && (
                  <Link
                    href={user.role === "admin" ? "/admin" : "/staff"}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}

            {/* Mobile Auth Actions Section */}
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="px-2 py-1 text-sm text-gray-500 font-medium">
                    Signed in as: <span className="text-gray-800">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}