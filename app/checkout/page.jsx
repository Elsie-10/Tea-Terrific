"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Smartphone, MapPin, User, CheckCircle, Loader } from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ customerName: "", phone: "", location: "" });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // form | paying | success
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!/^(0|\+?254)[17]\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
      e.phone = "Enter a valid Kenyan phone number";
    }
    if (!form.location.trim()) e.location = "Delivery location is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          location: form.location,
          items: cart.map((i) => ({
            productId: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          total: totalAmount,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      const newOrderId = orderData.data._id;
      setOrderId(newOrderId);
      setStep("paying");

      // 2. Initiate STK Push
      const mpesaRes = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, amount: totalAmount, orderId: newOrderId }),
      });
      const mpesaData = await mpesaRes.json();
      if (!mpesaData.success) throw new Error(mpesaData.error);

      setMessage("Check your phone — enter your M-Pesa PIN to complete payment.");

      // 3. Poll for payment confirmation (up to 60 seconds)
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        if (attempts > 12) {
          clearInterval(poll);
          setMessage("Payment timed out. Please contact us if you were charged.");
          return;
        }
        const statusRes = await fetch(`/api/orders/${newOrderId}`);
        const statusData = await statusRes.json();
        if (statusData.data?.paymentStatus === "Paid") {
          clearInterval(poll);
          clearCart();
          setStep("success");
        } else if (statusData.data?.paymentStatus === "Failed") {
          clearInterval(poll);
          setMessage("Payment failed. Please try again.");
          setStep("form");
        }
      }, 5000);
    } catch (err) {
      setMessage(err.message || "Something went wrong. Please try again.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <CheckCircle className="w-20 h-20 text-[#4A7C59] mb-6" />
          <h1 className="font-serif text-4xl font-bold text-[#2C2C2C] mb-3">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you, {form.customerName}!</p>
          <p className="text-gray-500 text-sm mb-8 max-w-md">
            Your order is being prepared. We'll have it ready for you soon.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href={`/order/${orderId}`} className="btn-secondary">Track Order</a>
            <a href="/" className="btn-outline">Order More</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-8">Checkout</h1>

        {message && (
          <div className="bg-[#FDF8F0] border border-[#D4A843] rounded-lg p-4 mb-6 text-sm text-[#6B3F1F]">
            {message}
          </div>
        )}

        {step === "paying" ? (
          <div className="card p-10 text-center">
            <Loader className="w-12 h-12 text-[#D4A843] mx-auto mb-4 animate-spin" />
            <h2 className="font-serif text-2xl font-bold mb-2">Waiting for Payment</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        ) : (
          <div className="card p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">
                <User className="inline w-4 h-4 mr-1" />Full Name
              </label>
              <input
                className="input-field"
                placeholder="Jane Muthoni"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">
                <Smartphone className="inline w-4 h-4 mr-1" />M-Pesa Phone Number
              </label>
              <input
                className="input-field"
                placeholder="0712 345 678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-1">
                <MapPin className="inline w-4 h-4 mr-1" />Delivery Location
              </label>
              <input
                className="input-field"
                placeholder="e.g. Westlands, Nairobi"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Order total */}
            <div className="border-t border-[#F2E0D0] pt-4 flex justify-between font-bold text-[#2C2C2C]">
              <span>Total to Pay</span>
              <span className="text-[#6B3F1F]">KES {totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || cart.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
              Pay with M-Pesa
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
