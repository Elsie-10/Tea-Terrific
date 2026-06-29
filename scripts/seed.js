/**
 * Seed script — run once to bootstrap the database
 * Usage: node scripts/seed.js
 *
 * Requires: MONGODB_URI in .env.local
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set in .env.local");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected to MongoDB");

  // --- Models ---
  const UserSchema = new mongoose.Schema({ email: String, password: String, role: String, name: String });
  const ProductSchema = new mongoose.Schema({
    name: String, price: Number, description: String,
    image: String, category: String, available: Boolean, featured: Boolean,
  });
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

  // --- Admin user ---
  const existing = await User.findOne({ email: "admin@teaterrific.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin@2024!", 12);
    await User.create({
      email: "admin@teaterrific.com",
      password: hashed,
      role: "admin",
      name: "Tea-Terrific Admin",
    });
    console.log("✅  Admin user created");
    console.log("    Email:    admin@teaterrific.com");
    console.log("    Password: Admin@2024!");
    console.log("    ⚠️   Change this password after first login!");
  } else {
    console.log("ℹ️   Admin user already exists, skipping.");
  }

  // --- Sample products ---
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: "Chocolate Fudge Cake", price: 1800, category: "Cake", available: true, featured: true,
        description: "Rich, moist chocolate cake layered with velvety fudge frosting.", image: "/images/chocolate-cake.jpg" },
      { name: "Vanilla Sponge Cake", price: 1500, category: "Cake", available: true, featured: false,
        description: "Light vanilla sponge with fresh cream and strawberries.", image: "/images/vanilla-cake.jpg" },
      { name: "Sourdough Loaf", price: 450, category: "Bread", available: true, featured: true,
        description: "Slow-fermented artisan sourdough with a crispy crust.", image: "/images/sourdough.jpg" },
      { name: "Butter Croissant", price: 150, category: "Pastry", available: true, featured: false,
        description: "Flaky, buttery croissant baked fresh every morning.", image: "/images/croissant.jpg" },
      { name: "Cinnamon Roll", price: 200, category: "Pastry", available: true, featured: true,
        description: "Soft cinnamon roll glazed with cream cheese frosting.", image: "/images/cinnamon-roll.jpg" },
      { name: "Chocolate Chip Cookies (6)", price: 350, category: "Cookie", available: true, featured: false,
        description: "Thick, chewy cookies loaded with Belgian chocolate chips.", image: "/images/cookies.jpg" },
      { name: "Masala Chai", price: 120, category: "Drink", available: true, featured: false,
        description: "Aromatic spiced tea brewed with ginger, cardamom, and milk.", image: "/images/chai.jpg" },
      { name: "Red Velvet Cake", price: 2000, category: "Cake", available: true, featured: true,
        description: "Classic red velvet with tangy cream cheese frosting.", image: "/images/red-velvet.jpg" },
    ]);
    console.log("✅  Sample products created");
  } else {
    console.log(`ℹ️   Products already exist (${count} found), skipping.`);
  }

  await mongoose.disconnect();
  console.log("🎉  Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
