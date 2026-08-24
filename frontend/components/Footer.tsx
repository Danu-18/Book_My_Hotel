"use client";

import Link from "next/link";
import { Palmtree } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="px-4 py-14 sm:px-6 mt-auto" style={{ backgroundImage: "var(--gradient-footer)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 text-cocoa-foreground md:grid-cols-[2fr_1fr_1fr]">
        {/* About section */}
        <div>
          <div className="flex items-center gap-2">
            <Palmtree className="size-5 shrink-0" />
            <span className="font-display text-xl font-bold">
              BookMyHotel<span className="opacity-70 font-sans">.com</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm opacity-80">
            Your premier platform for luxury hotel reservations across Marriott, Hilton, Hyatt,
            and Four Seasons. Best price promise and secure payments.
          </p>
          <p className="mt-6 text-xs opacity-60">
            © {new Date().getFullYear()} BookMyHotel.com. All rights reserved.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-widest opacity-80">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li>
              <Link href="/hotels" className="hover:underline transition-colors">
                Hotels
              </Link>
            </li>
            <li>
              <Link href="/promotions" className="hover:underline transition-colors">
                Deals & Promotions
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-widest opacity-80">
            Account
          </h3>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            {user ? (
              <>
                <li>
                  <Link href="/reservations" className="hover:underline transition-colors">
                    My Bookings
                  </Link>
                </li>
                <li className="opacity-70 text-xs mt-2">
                  Signed in as: <span className="font-semibold">{user.name}</span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:underline transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:underline transition-colors">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          {/* Social Icons (using inline SVGs to avoid package version export mismatch) */}
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Youtube"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.502 2.502 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 011.768-1.768C5.744 5 12 5 12 5s6.255 0 7.812.418zM10 9v6l5-3-5-3z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}