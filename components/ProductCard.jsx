import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORY_EMOJI = {
  Cake: "🎂", Loaf: "🍞", Cupcake: "🧁", Cookie: "🍪", Special: "✨", Drink: "☕", Other: "🛒",
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!session) { router.push("/auth/login"); return; }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 bg-[#FDF8F0] flex-shrink-0">
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; }}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-[#D4A843] text-white text-[10px] font-bold
                           uppercase tracking-widest px-2 py-1 rounded-full shadow">
            Popular
          </span>
        )}
        <span className="absolute top-2 right-2 text-xl">
          {CATEGORY_EMOJI[product.category] || "🛒"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[#4A7C59] font-semibold uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-[#2C2C2C] font-semibold text-base leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-3 mb-3 flex-1">{product.description}</p>

        {/* Flavour options chips */}
        {product.options?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.options.map((opt) => (
              <span key={opt} className="text-[10px] bg-[#FDF8F0] border border-[#F2E0D0]
                                         text-[#6B3F1F] px-2 py-0.5 rounded-full font-medium">
                {opt}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#6B3F1F] font-bold text-lg">
            Ksh {product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold
                        active:scale-95 transition-all duration-150
                        ${added
                          ? "bg-[#4A7C59] text-white"
                          : "bg-[#6B3F1F] text-white hover:bg-[#8B5A2B]"
                        }`}
          >
            <Plus className="w-4 h-4" />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
