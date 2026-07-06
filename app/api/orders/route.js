import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const { customerName, phone, location, items, total, userId } = await request.json();
    if (!customerName || !phone || !location || !items?.length || !total) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        total,
        user_id: userId || null,
        payment_status: "Pending",
        order_status: "Pending",
      })
      .select()
      .single();

    if (orderErr) throw new Error(orderErr.message);

    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.productId || null,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image || null,
      }))
    );
    if (itemsErr) throw new Error(itemsErr.message);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "owner") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const from = (page - 1) * limit;

    let query = supabaseAdmin
      .from("orders")
      .select("*, order_items(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (status) query = query.eq("order_status", status);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      data,
      pagination: { total: count || 0, page, limit, pages: Math.ceil((count || 0) / limit) },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
