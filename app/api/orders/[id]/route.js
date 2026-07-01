import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/orders/:id — admin or customer polling by orderId
export async function GET(_, { params }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    // Return safe subset for public polling
    return NextResponse.json({
      success: true,
      data: {
        _id: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        customerName: order.customerName,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/orders/:id — admin only (update status)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "owner"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { orderStatus, paymentStatus } = await request.json();

    const validOrderStatuses = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];
    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json({ success: false, error: "Invalid order status" }, { status: 400 });
    }

    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(params.id, update, { new: true });
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
