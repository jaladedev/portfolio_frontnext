"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";

const API = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      localStorage.setItem("token", data.access_token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl text-cream-100 mb-2">Admin Login</p>
          <p className="font-mono text-sm text-cream-200/40">JaladeDev CMS</p>
        </div>

        <div className="bg-ink-800 border border-ink-600 rounded-2xl p-8">
          {error && (
            <div className="mb-5 bg-red-400/10 border border-red-400/30 text-red-300 font-mono text-sm p-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-ink-900 border border-ink-500 rounded-lg px-4 py-3 text-cream-100
                           placeholder:text-cream-200/20 focus:outline-none focus:border-electric-400/60 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-cream-200/40 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-ink-900 border border-ink-500 rounded-lg px-4 py-3 pr-11 text-cream-100
                             placeholder:text-cream-200/20 focus:outline-none focus:border-electric-400/60 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-200/30 hover:text-cream-200/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-electric-500 hover:bg-electric-400
                         text-white font-semibold py-3.5 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-cream-200/20">
          <a href="/" className="hover:text-cream-200/50 transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
