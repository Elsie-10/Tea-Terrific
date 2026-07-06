import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { data: existing } = await supabaseAdmin.from("users").select("id").eq("email", normalizedEmail).maybeSingle();
    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({ name: name.trim(), email: normalizedEmail, password: hashed, phone: phone || "", role: "customer" })
      .select("id, name, email, role")
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

