"use client";

import { useState } from "react";
import Link from "next/link";
import { Palmtree } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Palmtree className="size-5 shrink-0 text-foreground" />
              <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                BookMyHotel<span className="text-muted-foreground font-sans">.com</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-x-6 text-sm font-medium text-foreground/80">
            <Link href="/hotels" className="transition-colors hover:text-foreground">
              Hotels
            </Link>
            <Link href="/promotions" className="transition-colors hover:text-foreground">
              Deals
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            {user && (
              <>
                <Link href="/reservations" className="transition-colors hover:text-foreground">
                  My Bookings
                </Link>
                {(user.role === "admin" || user.role === "staff") && (
                  <Link
                    href={user.role === "admin" ? "/admin" : "/staff"}
                    className="transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Auth Buttons / Mobile Hamburger Trigger */}
          <div className="flex items-center gap-3">
            {/* Desktop-only Auth controls */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-foreground/70">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-background shadow-md transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger Button (visible on mobile only) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col space-y-2 border-t border-border/60">
            <Link
              href="/hotels"
              onClick={() => setIsOpen(false)}
              className="text-foreground/80 hover:text-foreground font-medium px-2 py-1.5 rounded-md hover:bg-card transition-colors text-sm"
            >
              Hotels
            </Link>
            <Link
              href="/promotions"
              onClick={() => setIsOpen(false)}
              className="text-foreground/80 hover:text-foreground font-medium px-2 py-1.5 rounded-md hover:bg-card transition-colors text-sm"
            >
              Deals
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-foreground/80 hover:text-foreground font-medium px-2 py-1.5 rounded-md hover:bg-card transition-colors text-sm"
            >
              Contact
            </Link>
            {user && (
              <>
                <Link
                  href="/reservations"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground/80 hover:text-foreground font-medium px-2 py-1.5 rounded-md hover:bg-card transition-colors text-sm"
                >
                  My Bookings
                </Link>
                {(user.role === "admin" || user.role === "staff") && (
                  <Link
                    href={user.role === "admin" ? "/admin" : "/staff"}
                    onClick={() => setIsOpen(false)}
                    className="text-foreground/80 hover:text-foreground font-medium px-2 py-1.5 rounded-md hover:bg-card transition-colors text-sm"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}

            {/* Mobile Auth Actions Section */}
            <div className="pt-4 mt-2 border-t border-border/60 flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="px-2 py-1 text-xs text-muted-foreground font-medium">
                    Signed in as: <span className="text-foreground font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2 text-sm font-medium text-foreground hover:bg-card rounded-md transition-colors border border-border"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md shadow-md transition-opacity hover:opacity-90"
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