import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/products — public
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const query = { available: true };
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/products — admin only
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
