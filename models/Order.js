import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"],
      default: "Pending",
    },
    mpesaReceiptNumber: { type: String },
    mpesaTransactionId: { type: String },
    checkoutRequestId: { type: String },
  },
  { timestamps: true }
);

// Index for fast dashboard queries
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
