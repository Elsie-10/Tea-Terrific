"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#6B3F1F] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FDF8F0] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-[#6B3F1F]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2C2C2C]">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Tea-Terrific Bakery</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="admin@teaterrific.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
