import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() }).lean();

        if (!user) {
          throw new Error("No account found with that email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

async function registerUser(request) {
  try {
    await connectDB();
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 409 });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || "",
      role: "customer",
    });

    return NextResponse.json(
      { success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { pathname } = new URL(request.url);
  if (pathname === "/api/auth/register" || pathname === "/api/auth/signup") {
    return NextResponse.json({ success: false, error: "Use POST to register." }, { status: 405 });
  }
  return handler.GET(request);
}

export async function POST(request) {
  const { pathname } = new URL(request.url);
  if (pathname === "/api/auth/register" || pathname === "/api/auth/signup") {
    return registerUser(request);
  }
  return handler.POST(request);
}