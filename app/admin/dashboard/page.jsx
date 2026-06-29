"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Clock, ChefHat, CheckCircle, TrendingUp, LogOut, RefreshCw,
} from "lucide-react";
import OrderTable from "@/components/admin/OrderTable";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, ordersRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch(filter === "All" ? "/api/orders" : `/api/orders?status=${filter}`),
    ]);
    const [statsData, ordersData] = await Promise.all([statsRes.json(), ordersRes.json()]);
    if (statsData.success) setStats(statsData.data);
    if (ordersData.success) setOrders(ordersData.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filter]);

  const updateOrderStatus = async (orderId, orderStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus }),
    });
    if (res.ok) fetchData();
  };

  if (status === "loading" || !session) return null;

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: ShoppingBag, color: "bg-[#6B3F1F]" },
    { label: "Pending", value: stats?.pendingOrders ?? "—", icon: Clock, color: "bg-yellow-500" },
    { label: "Preparing", value: stats?.preparingOrders ?? "—", icon: ChefHat, color: "bg-blue-500" },
    { label: "Completed", value: stats?.completedOrders ?? "—", icon: CheckCircle, color: "bg-[#4A7C59]" },
    { label: "Revenue (KES)", value: stats?.totalRevenue?.toLocaleString() ?? "—", icon: TrendingUp, color: "bg-[#D4A843]" },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Admin header */}
      <header className="bg-[#6B3F1F] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold">Tea-Terrific</h1>
          <p className="text-[#F2E0D0] text-xs">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#F2E0D0] hidden sm:block">{session.user.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-1 text-sm text-[#F2E0D0] hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#2C2C2C]">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#2C2C2C]">Orders</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {["All", "Pending", "Preparing", "Ready", "Completed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  filter === s
                    ? "bg-[#6B3F1F] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#6B3F1F]"
                }`}
              >
                {s}
              </button>
            ))}
            <button onClick={fetchData} className="p-2 rounded-full hover:bg-white transition" aria-label="Refresh">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <OrderTable orders={orders} onStatusUpdate={updateOrderStatus} loading={loading} />
      </main>
    </div>
  );
}
