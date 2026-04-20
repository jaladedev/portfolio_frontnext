"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const LARAVEL_API = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setErrorMsg("All fields are required.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${LARAVEL_API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-2xl p-8">
      <h2 className="font-display text-2xl text-cream-100 mb-6">Send a message</h2>

      {/* Success state */}
      {status === "success" && (
        <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/30 rounded-lg p-4 mb-6">
          <CheckCircle size={18} className="text-green-400 shrink-0" />
          <p className="text-green-300 text-sm font-mono">
            Message sent! I'll get back to you soon.
          </p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-6">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <p className="text-red-300 text-sm font-mono">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-2">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full bg-ink-900 border border-ink-500 rounded-lg px-4 py-3 text-cream-100
                       placeholder:text-cream-200/20 focus:outline-none focus:border-electric-400/60
                       transition-colors font-sans text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-ink-900 border border-ink-500 rounded-lg px-4 py-3 text-cream-100
                       placeholder:text-cream-200/20 focus:outline-none focus:border-electric-400/60
                       transition-colors font-sans text-sm"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-2">
            Message
          </label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell me about your project..."
            className="w-full bg-ink-900 border border-ink-500 rounded-lg px-4 py-3 text-cream-100
                       placeholder:text-cream-200/20 focus:outline-none focus:border-electric-400/60
                       transition-colors font-sans text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-electric-500 hover:bg-electric-400
                     text-white font-semibold py-4 rounded-lg transition-all duration-300
                     hover:shadow-[0_0_20px_rgba(79,158,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
