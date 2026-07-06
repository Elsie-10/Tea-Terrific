import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { initiateStkPush } from "@/lib/mpesa";

export async function POST(request) {
  try {
    const { phone, amount, orderId } = await request.json();
    if (!phone || !amount || !orderId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin.from("orders").select("id").eq("id", orderId).maybeSingle();
    if (error || !order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const stkResponse = await initiateStkPush({ phone, amount, orderId });

    await supabaseAdmin.from("orders").update({ checkout_request_id: stkResponse.CheckoutRequestID }).eq("id", orderId);

    return NextResponse.json({
      success: true,
      message: "STK Push sent. Check your phone.",
      CheckoutRequestID: stkResponse.CheckoutRequestID,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
