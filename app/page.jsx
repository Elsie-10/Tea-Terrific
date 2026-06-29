import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getProducts() {
  await connectDB();
  const products = await Product.find({ available: true }).sort({ featured: -1, createdAt: -1 }).lean();
  return products.map((p) => ({ ...p, _id: p._id.toString() }));
}

export default async function HomePage() {
  const products = await getProducts();

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#6B3F1F] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest mb-3">
            Freshly Baked Daily
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Tea-Terrific Bakery
          </h1>
          <p className="text-[#F2E0D0] text-lg max-w-xl mx-auto">
            Artisan cakes, breads, and pastries — order online and pay securely with M-Pesa.
          </p>
        </div>
      </section>

      {/* Product grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-8">Our Menu</h2>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No products available yet.</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F2E0D0] py-8 text-center text-sm text-gray-400 bg-white">
        <p>© {new Date().getFullYear()} Tea-Terrific Bakery. Made with ♥ in Nairobi.</p>
      </footer>
    </div>
  );
}
