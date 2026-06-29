"use client";

import Image from "next/image";
import { Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative w-full h-48 bg-[#FDF8F0]">
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-[#D4A843] text-white text-[10px] font-bold
                           uppercase tracking-widest px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-[#4A7C59] font-semibold uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-[#2C2C2C] font-semibold text-lg leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-[#6B3F1F] font-bold text-lg">
            KES {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1 bg-[#6B3F1F] text-white px-4 py-2 rounded-lg
                       text-sm font-semibold hover:bg-[#8B5A2B] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
