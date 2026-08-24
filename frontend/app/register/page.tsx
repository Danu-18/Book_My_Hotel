"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      router.push("/");
    } catch (err: unknown) {
      const errorData = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      const errors = errorData.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        setError(firstError || "Registration failed.");
      } else {
        setError(errorData.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 bg-background text-foreground">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground font-display">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join BookMyHotel.com today</p>
          </div>

          {error && (
            <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Full Name
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Smith"
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>

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
                  placeholder="you@example.com"
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Phone Number (optional)
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 000 0000"
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
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                Confirm Password
              </span>
              <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter your password"
                  className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground font-semibold"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}