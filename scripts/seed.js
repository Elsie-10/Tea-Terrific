/**
 * Tea-Terrific Seed Script
 * Usage: node scripts/seed.js
 * Add --force flag to wipe and re-seed products: node scripts/seed.js --force
 */

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("❌  MONGODB_URI not set"); process.exit(1); }

const force = process.argv.includes("--force");

// ── Schemas ────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String, phone: String,
});
const ProductSchema = new mongoose.Schema({
  name: String, price: Number, description: String,
  image: String, category: String, available: Boolean, featured: Boolean,
  options: [String],
});

// ── Real products from the Tea-rific Treats menu ───────────────────────────
const PRODUCTS = [
  // ── Cakes ──
  {
    name: "Cake – 1 Kg",
    price: 4000,
    category: "Cake",
    featured: true,
    description: "Layered cake with swiss meringue butter cream frosting and a filling of your choice. Cake options: Vanilla, Chocolate, Carrot Cinnamon. Filling options: Lemon curd, Passion curd, Orange curd, Berry compote, Cream Cheese.",
    image: "/images/cake-1kg.jpg",
    options: ["Vanilla", "Chocolate", "Carrot Cinnamon"],
  },
  {
    name: "Cake – 1½ Kg",
    price: 6000,
    category: "Cake",
    featured: false,
    description: "Layered cake with swiss meringue butter cream frosting and a filling of your choice. Cake options: Vanilla, Chocolate, Carrot Cinnamon. Filling options: Lemon curd, Passion curd, Orange curd, Berry compote, Cream Cheese.",
    image: "/images/cake-1.5kg.jpg",
    options: ["Vanilla", "Chocolate", "Carrot Cinnamon"],
  },
  {
    name: "Cake – 2 Kg",
    price: 8000,
    category: "Cake",
    featured: false,
    description: "Layered cake with swiss meringue butter cream frosting and a filling of your choice. Cake options: Vanilla, Chocolate, Carrot Cinnamon. Filling options: Lemon curd, Passion curd, Orange curd, Berry compote, Cream Cheese.",
    image: "/images/cake-2kg.jpg",
    options: ["Vanilla", "Chocolate", "Carrot Cinnamon"],
  },
  // ── Loaves ──
  {
    name: "Single Loaf",
    price: 1500,
    category: "Loaf",
    featured: true,
    description: "Freshly baked loaf in your choice of flavour. Loaf options: Vanilla, Chocolate, Chocolate Mint, Carrot Cinnamon, Banana.",
    image: "/images/loaf-single.jpg",
    options: ["Vanilla", "Chocolate", "Chocolate Mint", "Carrot Cinnamon", "Banana"],
  },
  {
    name: "Double Loaf",
    price: 3000,
    category: "Loaf",
    featured: false,
    description: "Two freshly baked loaves in your choice of flavours. Loaf options: Vanilla, Chocolate, Chocolate Mint, Carrot Cinnamon, Banana.",
    image: "/images/loaf-double.jpg",
    options: ["Vanilla", "Chocolate", "Chocolate Mint", "Carrot Cinnamon", "Banana"],
  },
  // ── Cupcakes ──
  {
    name: "Cupcakes – Dozen (12 pcs)",
    price: 1800,
    category: "Cupcake",
    featured: true,
    description: "A dozen (12 pieces) of butter cream frosted cupcakes. Perfect for birthdays, events, or a sweet treat for the whole team.",
    image: "/images/cupcakes.jpg",
    options: [],
  },
  // ── Specials ──
  {
    name: "Fruit Cake",
    price: 5000,
    category: "Special",
    featured: true,
    description: "A rich, moist fruit cake packed with premium dried fruits. Great for celebrations, gifting, and festive occasions.",
    image: "/images/fruit-cake.jpg",
    options: [],
  },
  {
    name: "Large Celebration Cake",
    price: 9000,
    category: "Special",
    featured: true,
    description: "Our showstopper large celebration cake — ideal for weddings, milestones, and big birthdays. Custom decorated to your occasion.",
    image: "/images/celebration-cake.jpg",
    options: ["Vanilla", "Chocolate", "Carrot Cinnamon"],
  },
  // ── Cookies ──
  {
    name: "Cookies – Full Batch",
    price: 1800,
    category: "Cookie",
    featured: false,
    description: "A full batch of freshly baked cookies. Available in Chocolate Chip or Ginger. Crispy on the outside, chewy on the inside.",
    image: "/images/cookies.jpg",
    options: ["Chocolate Chip", "Ginger"],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected to MongoDB");

  const User    = mongoose.models.User    || mongoose.model("User",    UserSchema);
  const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

  // ── Owner account ──────────────────────────────────────────────────────
  const ownerEmail = "owner@teaterrific.com";
  const existing   = await User.findOne({ email: ownerEmail });
  if (!existing) {
    const hashed = await bcrypt.hash("Owner@2024!", 12);
    await User.create({
      name: "Tea-Terrific Owner", email: ownerEmail,
      password: hashed, role: "owner", phone: "0720216244",
    });
    console.log("✅  Owner account created");
    console.log("    Email:    owner@teaterrific.com");
    console.log("    Password: Owner@2024!");
    console.log("    ⚠️   Change this password after first login!");
  } else {
    console.log("ℹ️   Owner account already exists, skipping.");
  }

  // ── Products ──────────────────────────────────────────────────────────
  const count = await Product.countDocuments();
  if (count === 0 || force) {
    if (force) { await Product.deleteMany({}); console.log("🗑️   Cleared existing products."); }
    await Product.insertMany(PRODUCTS.map((p) => ({ ...p, available: true })));
    console.log(`✅  ${PRODUCTS.length} products seeded from the Tea-rific Treats menu.`);
  } else {
    console.log(`ℹ️   ${count} products already exist. Run with --force to re-seed.`);
  }

  await mongoose.disconnect();
  console.log("🎉  Seed complete!");
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
