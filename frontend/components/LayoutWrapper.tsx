"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/staff") || pathname.startsWith("/admin");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex-1 flex flex-col">{children}</div>
      {!isDashboard && <Footer />}
    </>
  );
}
