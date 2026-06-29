import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image:       { type: String, default: "/images/placeholder.jpg" },
    category: {
      type: String,
      required: true,
      enum: ["Cake", "Loaf", "Cupcake", "Cookie", "Special", "Drink", "Other"],
    },
    available: { type: Boolean, default: true },
    featured:  { type: Boolean, default: false },
    options:   [{ type: String }],   // e.g. flavour choices shown at order time
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
