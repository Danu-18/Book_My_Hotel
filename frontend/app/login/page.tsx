"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (next && next.startsWith("/book")) {
      toast.warn("Please login first to book a room.", {
        toastId: "login-to-book",
      });
    }
  }, [next]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "staff") {
        router.push("/staff");
      } else {
        router.push(next);
      }
    }
  }, [user, authLoading, router, next]);

  if (authLoading || user) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      toast.error(errorData.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 bg-background text-foreground">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground font-display">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Login to your BookMyHotel account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Email Address
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Password
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register now
            </Link>
          </div>

          {/* Demo credentials */}
          {/* <div className="mt-8 border-t border-border/60 pt-6">
            <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest mb-3">Demo Accounts</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="bg-background rounded-lg border border-border p-3 text-xs leading-relaxed">
                <div><strong className="text-foreground">Admin:</strong> admin@bookmyhotel.com</div>
                <div><strong className="text-foreground">Staff:</strong> staff@bookmyhotel.com</div>
                <div><strong className="text-foreground">Customer:</strong> customer@bookmyhotel.com</div>
                <div><strong className="text-foreground">Password:</strong> password123</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center py-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    }>
      <LoginPageContent />
    </Suspense>
  );
}