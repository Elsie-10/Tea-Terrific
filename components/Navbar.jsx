"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-[#F2E0D0] sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-serif text-[#6B3F1F]">Tea-Terrific</span>
          <span className="text-xs text-[#4A7C59] font-medium hidden sm:block tracking-widest uppercase">
            Bakery
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#6B3F1F] transition">
            Menu
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-[#6B3F1F] transition">
            About
          </Link>
        </div>

        {/* Cart */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 hover:bg-[#FDF8F0] rounded-full transition">
            <ShoppingCart className="w-5 h-5 text-[#6B3F1F]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4A843] text-white text-[10px] font-bold
                               w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 hover:bg-[#FDF8F0] rounded-full"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#F2E0D0] bg-white px-4 py-3 flex flex-col gap-3">
          <Link href="/" className="text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            Menu
          </Link>
          <Link href="/about" className="text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
