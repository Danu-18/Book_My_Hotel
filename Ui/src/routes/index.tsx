import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  Users,
  Star,
  ArrowRight,
  Palmtree,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import hotelDubai from "@/assets/hotel-dubai.jpg";
import hotelBeach from "@/assets/hotel-beach.jpg";
import hotelPool from "@/assets/hotel-pool.jpg";
import hotelCabana from "@/assets/hotel-cabana.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookMyHotel.com — Discover Your Perfect Stay" },
      {
        name: "description",
        content:
          "Book luxury rooms across Marriott, Hilton, Hyatt and Four Seasons with the best price guarantee.",
      },
      { property: "og:title", content: "BookMyHotel.com — Discover Your Perfect Stay" },
      {
        property: "og:description",
        content:
          "Book luxury rooms across Marriott, Hilton, Hyatt and Four Seasons with the best price guarantee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const partners = ["Marriott", "Hilton", "HYATT", "Four Seasons"];

const hotels = [
  { name: "Marriott Downtown Dubai", city: "Dubai, UAE", img: hotelDubai },
  { name: "Hilton Corniche Abu Dhabi", city: "Abu Dhabi, UAE", img: hotelBeach },
  { name: "Hyatt Regency Istanbul", city: "Istanbul, Turkey", img: hotelPool },
  { name: "Four Seasons London", city: "London, UK", img: hotelCabana },
];

const deals = [
  {
    title: "Marriott Summer Special",
    desc: "Save 15% on summer bookings at Marriott Downtown Dubai",
    code: "MARRIOTT15",
    off: "-15.00%",
  },
  {
    title: "Hilton Summer Special",
    desc: "Save 12% on summer bookings at Hilton Corniche Abu Dhabi",
    code: "HILTON12",
    off: "-12.00%",
  },
  {
    title: "Hyatt Summer Special",
    desc: "Save 15% on summer bookings at Hyatt Regency Istanbul",
    code: "HYATT15",
    off: "-15.00%",
  },
  {
    title: "Four Seasons Summer Special",
    desc: "Save 13% on summer bookings at Four Seasons London",
    code: "FOURSEASONS13",
    off: "-13.00%",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-card/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto]">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <Palmtree className="size-5 shrink-0 text-primary" />
            <span className="truncate font-display text-lg font-bold tracking-tight text-primary sm:text-xl">
              BookMyHotel<span className="text-muted-foreground">.com</span>
            </span>
          </a>

          <nav className="col-span-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-foreground/80 lg:col-span-1 lg:order-none">
            {["Hotels", "Deals", "Contact", "My Bookings"].map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-primary">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 justify-self-end">
            <span className="hidden text-sm text-muted-foreground sm:inline">Hi, Daniel</span>
            <button className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroBg}
          alt="Sunlit coral reef"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 size-full object-cover opacity-70"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="font-display text-4xl font-bold leading-tight text-cocoa sm:text-5xl lg:text-6xl">
            Discover Your Perfect Stay
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-cocoa/80 sm:text-lg">
            Book luxury rooms across Marriott, Hilton, Hyatt, and Four Seasons with the best price
            guarantee.
          </p>

          {/* Search card */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-sand/90 p-4 text-left shadow-[var(--shadow-card)] ring-1 ring-border/50 backdrop-blur sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
              <Field label="City / Hotel">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Dubai, London, Istanbul..."
                  />
                </div>
              </Field>
              <Field label="Check In">
                <input type="date" className="w-full min-w-0 bg-transparent text-sm outline-none" />
              </Field>
              <Field label="Check Out">
                <input type="date" className="w-full min-w-0 bg-transparent text-sm outline-none" />
              </Field>
              <Field label="Guests">
                <div className="flex items-center justify-between gap-2">
                  <select className="w-full min-w-0 bg-transparent text-sm outline-none">
                    <option>1 Guest</option>
                    <option defaultChecked>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                  <Users className="size-4 shrink-0 text-muted-foreground" />
                </div>
              </Field>
            </div>
            <button className="mt-4 w-full rounded-lg bg-clay px-6 py-3 text-sm font-semibold text-clay-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90">
              Search Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section
        className="px-4 py-14 sm:px-6"
        style={{ backgroundImage: "var(--gradient-partners)" }}
      >
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-cocoa sm:text-3xl">Our Partner Hotel Chains</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Five-star luxury guaranteed across four world renowned brands
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {partners.map((p) => (
              <div
                key={p}
                className="flex h-24 items-center justify-center rounded-xl bg-card px-4 shadow-[var(--shadow-soft)] sm:h-28"
              >
                <span className="truncate font-display text-lg font-bold tracking-wide text-clay sm:text-2xl">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured hotels */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="truncate text-2xl font-bold text-cocoa sm:text-3xl">Featured Hotels</h2>
          <a
            href="#"
            className="flex shrink-0 items-center gap-1 text-sm text-foreground/80 hover:text-primary"
          >
            View All <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <article
              key={h.name}
              className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
            >
              <img
                src={h.img}
                alt={h.name}
                loading="lazy"
                width={768}
                height={576}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-1 p-4">
                <h3 className="truncate font-sans text-base font-semibold text-cocoa">{h.name}</h3>
                <p className="text-sm text-muted-foreground">{h.city}</p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">4 rooms</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-bold text-cocoa sm:text-3xl">Current Deals</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {deals.map((d) => (
            <div key={d.title} className="rounded-xl bg-peach/60 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <h3 className="min-w-0 font-sans text-base font-semibold text-cocoa">{d.title}</h3>
                <span className="shrink-0 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-clay-foreground">
                  {d.off}
                </span>
              </div>
              <p className="mt-1 text-sm text-cocoa/75">{d.desc}</p>
              <p className="mt-3 text-xs text-cocoa/70">
                Use code: <span className="font-semibold tracking-wide text-cocoa">{d.code}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-clay px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-clay-foreground sm:text-4xl">
          Ready to Book Your Stay?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-clay-foreground/85 sm:text-base">
          Browse our wide selection of luxury 5-star hotels and find the perfect room today.
        </p>
        <button className="mt-8 rounded-lg bg-cocoa px-8 py-3 text-sm font-semibold text-cocoa-foreground shadow-[var(--shadow-card)] transition-opacity hover:opacity-90">
          Browse Hotels
        </button>
      </section>

      {/* Footer */}
      <footer className="px-4 py-14 sm:px-6" style={{ backgroundImage: "var(--gradient-footer)" }}>
        <div className="mx-auto grid max-w-7xl gap-10 text-cocoa-foreground md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Palmtree className="size-5 shrink-0" />
              <span className="font-display text-xl font-bold">
                BookMyHotel<span className="opacity-70">.com</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm opacity-80">
              Your premier platform for luxury hotel reservations across Marriott, Hilton, Hyatt,
              and Four Seasons. Best price promise and secure payments.
            </p>
            <p className="mt-6 text-xs opacity-60">
              © 2026 BookMyHotel.com. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest opacity-80">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm opacity-90">
              {["Hotels", "Deals & Promotions", "Contact Us"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:underline">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest opacity-80">
              Account
            </h3>
            <ul className="mt-4 space-y-2 text-sm opacity-90">
              <li>
                <a href="#" className="hover:underline">
                  My Bookings
                </a>
              </li>
              <li className="opacity-70">Signed in as Daniel</li>
            </ul>
            <div className="mt-4 flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="opacity-80 hover:opacity-100">
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 rounded-lg bg-card px-3 py-2.5 ring-1 ring-border">{children}</div>
    </label>
  );
}
