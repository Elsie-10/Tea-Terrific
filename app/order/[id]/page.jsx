import Navbar from "@/components/Navbar";
import { CheckCircle, Clock, ChefHat, Package } from "lucide-react";

const STATUS_STEPS = ["Pending", "Preparing", "Ready", "Completed"];
const STATUS_ICONS = {
  Pending: Clock,
  Preparing: ChefHat,
  Ready: Package,
  Completed: CheckCircle,
};

async function getOrder(id) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/orders/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function OrderTrackingPage({ params }) {
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h2 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-2">Order not found</h2>
          <p className="text-gray-500">Double-check the link and try again.</p>
        </div>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-2">Order Status</h1>
        <p className="text-gray-500 text-sm mb-8">
          Hello {order.customerName} · Order placed {new Date(order.createdAt).toLocaleDateString("en-KE")}
        </p>

        {/* Payment badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-8
          ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {order.paymentStatus === "Paid" ? "✓ Payment confirmed" : "⏳ Payment pending"}
        </div>

        {/* Progress */}
        <div className="card p-6">
          <div className="flex items-start justify-between">
            {STATUS_STEPS.map((status, idx) => {
              const Icon = STATUS_ICONS[status];
              const done = idx <= currentStepIdx;
              const active = idx === currentStepIdx;
              return (
                <div key={status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                      ${done ? "bg-[#4A7C59] text-white" : "bg-gray-100 text-gray-400"}
                      ${active ? "ring-4 ring-[#4A7C59]/20" : ""}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-semibold text-center ${active ? "text-[#4A7C59]" : "text-gray-400"}`}>
                    {status}
                  </p>
                  {/* Connector line */}
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`absolute hidden`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Horizontal line between steps */}
          <div className="relative mt-[-2.8rem] mb-10 mx-5 h-0.5 bg-gray-100 -z-10">
            <div
              className="h-full bg-[#4A7C59] transition-all duration-500"
              style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-2xl font-serif font-bold text-[#2C2C2C]">{order.orderStatus}</p>
            <p className="text-gray-500 text-sm mt-1">
              Total: <span className="font-semibold text-[#6B3F1F]">KES {order.total?.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
