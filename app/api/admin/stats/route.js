import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [totalOrders, pendingOrders, preparingOrders, completedOrders, revenueResult] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "Pending" }),
        Order.countDocuments({ orderStatus: "Preparing" }),
        Order.countDocuments({ orderStatus: "Completed" }),
        Order.aggregate([
          { $match: { paymentStatus: "Paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: { totalOrders, pendingOrders, preparingOrders, completedOrders, totalRevenue },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
