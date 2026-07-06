import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const callback = body?.Body?.stkCallback;
    if (!callback) return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("checkout_request_id", CheckoutRequestID)
      .maybeSingle();

    if (!order) return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (ResultCode === 0) {
      const meta = {};
      CallbackMetadata?.Item?.forEach((item) => { meta[item.Name] = item.Value; });
      await supabaseAdmin.from("orders").update({
        payment_status: "Paid",
        order_status: "Preparing",
        mpesa_receipt_number: meta.MpesaReceiptNumber || null,
        mpesa_transaction_id: meta.TransactionDate?.toString() || null,
      }).eq("id", order.id);
    } else {
      await supabaseAdmin.from("orders").update({ payment_status: "Failed" }).eq("id", order.id);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
