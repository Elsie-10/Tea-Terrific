"use client";

const STATUS_OPTIONS = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];

export default function OrderTable({ orders, onStatusUpdate, loading }) {
  if (loading) {
    return (
      <div className="card p-8 text-center text-gray-400">
        <p>Loading orders…</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="card p-12 text-center text-gray-400">
        <p className="text-lg font-semibold">No orders found</p>
        <p className="text-sm mt-1">New orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#F2E0D0] bg-[#FDF8F0]">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-[#F2E0D0] hover:bg-[#FDF8F0] transition">
              <td className="px-4 py-3 font-semibold text-[#2C2C2C]">{order.customerName}</td>
              <td className="px-4 py-3 text-gray-600">{order.phone}</td>
              <td className="px-4 py-3 text-gray-600">{order.location}</td>
              <td className="px-4 py-3 text-gray-600">
                {order.items?.map((i) => (
                  <span key={i.productId} className="block text-xs">
                    {i.quantity}× {i.name}
                  </span>
                ))}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-[#6B3F1F]">
                KES {order.total?.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span className={`status-badge ${
                  order.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "Failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#D4A843] cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                {new Date(order.createdAt).toLocaleDateString("en-KE", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
