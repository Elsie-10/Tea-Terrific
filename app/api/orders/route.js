import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/orders — public (customer places order)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { customerName, phone, location, items, total } = body;

    // Basic validation
    if (!customerName || !phone || !location || !items?.length || !total) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      items,
      total,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET /api/orders — admin only
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "owner"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query = {};
    if (status) query.orderStatus = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
