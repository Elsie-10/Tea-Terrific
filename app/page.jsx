"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["All", "Cake", "Loaf", "Cupcake", "Cookie", "Special"];

export default function HomePage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    let mounted = true;

    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success) setProducts(d.data || []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visible = activeTab === "All"
    ? products
    : products.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#6B3F1F] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="text-center lg:text-left">
            <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest mb-3">
              Freshly Baked Daily
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Tea-rific Treats
            </h1>
            <p className="text-[#F2E0D0] text-lg max-w-xl mx-auto lg:mx-0 mb-2">
              Artisan cakes, loaves, cupcakes & cookies — order online and pay securely with M-Pesa.
            </p>
            <p className="text-[#D4A843] text-sm mt-3">
              📞 0720 216 244 &nbsp;·&nbsp; Orders 24 hrs in advance &nbsp;·&nbsp; 50% deposit required
            </p>
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
              <a href="#menu" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#6B3F1F] transition hover:bg-[#F2E0D0]">
                View Menu
              </a>
              <a href="/checkout" className="rounded-full border border-[#D4A843] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7E4A23]">
                Order Now
              </a>
            </div>
          </div>

          <div id="menu" className="overflow-hidden rounded-[2rem] border border-[#D4A843]/40 shadow-xl">
            <Image
              src="/images/Backery0.jpeg"
              alt="Tea-rific bakery menu"
              width={1200}
              height={800}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <div className="bg-white border-b border-[#F2E0D0] sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === cat
                  ? "bg-[#6B3F1F] text-white"
                  : "bg-[#FDF8F0] text-gray-600 hover:bg-[#F2E0D0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="w-full h-48 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-5 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🧁</p>
            <p className="text-lg font-semibold">No items in this category yet.</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Terms notice */}
        <div className="mt-16 bg-[#FDF8F0] border border-[#D4A843] rounded-2xl p-6 text-center">
          <h3 className="font-serif text-lg font-bold text-[#6B3F1F] mb-2">Terms & Conditions</h3>
          <p className="text-gray-600 text-sm">
            For the best experience, please order <strong>24 hours in advance</strong> with a{" "}
            <strong>50% deposit</strong>. Extra charges apply for additional items and delivery.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F2E0D0] py-8 text-center text-sm text-gray-400 bg-white">
        <p className="font-serif text-[#6B3F1F] font-bold text-lg mb-1">Tea-Terrific Bakery</p>
        <p>📞 <a href="tel:0720216244" className="hover:underline">0720 216 244</a></p>
        <p className="mt-2">© {new Date().getFullYear()} Tea-Terrific Bakery. Made with ♥ in Nairobi.</p>
      </footer>
    </div>
  );
}