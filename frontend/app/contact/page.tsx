"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use dynamic import to only load API on client-side
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { api } = await import("@/lib/api");
      await api.post("/contact", formData);
      setSubmitted(true);
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-background text-foreground">
        <div className="bg-card rounded-2xl shadow-xl ring-1 ring-border/50 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-primary text-3xl font-bold">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground font-display">Message Sent!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for contacting BookMyHotel.com. Our team will get back to you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            className="mt-6 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90"
          >
            Send Another Message
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full bg-background text-foreground">
      <h1 className="text-3xl font-bold text-foreground font-display">Contact Us</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Have a question about your booking or need assistance? Send us a message.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
            {error && (
              <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block min-w-0">
                  <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                    Full Name
                  </span>
                  <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="John Smith"
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="you@example.com"
                      className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                    />
                  </div>
                </label>
              </div>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Subject
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="How can we help?"
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                  />
                </div>
              </label>

              <label className="block min-w-0">
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">
                  Message
                </span>
                <div className="mt-1 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border">
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-foreground"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
            <h2 className="text-lg font-bold text-foreground font-display">Contact Information</h2>
            <div className="mt-4 space-y-3 text-sm text-foreground/80">
              <p>
                <strong className="text-foreground">Head Office:</strong>
                <br />
                Sheikh Zayed Road
                <br />
                Dubai, United Arab Emirates
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>
                <br />
                support@bookmyhotel.com
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong>
                <br />
                +971 4 000 0000
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-xl p-6 ring-1 ring-border/50">
            <h2 className="text-lg font-bold text-foreground font-display">Business Hours</h2>
            <div className="mt-3 space-y-2 text-sm text-foreground/80">
              <p><strong>Mon - Fri:</strong> 9:00 AM - 8:00 PM</p>
              <p><strong>Saturday:</strong> 10:00 AM - 6:00 PM</p>
              <p><strong>Sunday:</strong> Closed</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}