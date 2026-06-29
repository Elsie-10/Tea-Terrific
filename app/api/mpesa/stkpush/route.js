import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { initiateStkPush } from "@/lib/mpesa";

// POST /api/mpesa/stkpush
export async function POST(request) {
  try {
    await connectDB();
    const { phone, amount, orderId } = await request.json();

    if (!phone || !amount || !orderId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const stkResponse = await initiateStkPush({ phone, amount, orderId });

    // Save the CheckoutRequestID for callback matching
    await Order.findByIdAndUpdate(orderId, {
      checkoutRequestId: stkResponse.CheckoutRequestID,
    });

    return NextResponse.json({
      success: true,
      message: "STK Push sent. Check your phone.",
      CheckoutRequestID: stkResponse.CheckoutRequestID,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
