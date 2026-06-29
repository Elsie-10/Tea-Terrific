"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <ShoppingBag className="w-16 h-16 text-[#D4A843] mb-4" />
          <h2 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious treats to get started.</p>
          <Link href="/" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="card flex gap-4 p-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#FDF8F0]">
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#2C2C2C] truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-[#6B3F1F] font-bold mt-1">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-72">
            <div className="card p-6 sticky top-20">
              <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Delivery</span>
                <span className="text-[#4A7C59]">Calculated at checkout</span>
              </div>
              <div className="border-t border-[#F2E0D0] pt-4 flex justify-between font-bold text-[#2C2C2C]">
                <span>Total</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="btn-primary w-full mt-6 block text-center">
                Proceed to Checkout
              </Link>
              <Link href="/" className="block text-center text-sm text-[#4A7C59] mt-3 hover:underline">
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
