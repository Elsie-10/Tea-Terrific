import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// POST /api/mpesa/callback — called by Safaricom servers
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;

    const order = await Order.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!order) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (ResultCode === 0) {
      // Payment successful — extract metadata
      const meta = {};
      CallbackMetadata?.Item?.forEach((item) => {
        meta[item.Name] = item.Value;
      });

      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "Paid",
        orderStatus: "Preparing",
        mpesaReceiptNumber: meta.MpesaReceiptNumber,
        mpesaTransactionId: meta.TransactionDate?.toString(),
      });
    } else {
      // Payment failed
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "Failed",
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
