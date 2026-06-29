import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Owner-only routes
    if (pathname.startsWith("/owner") || pathname.startsWith("/admin")) {
      if (!token || token.role !== "owner") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Customer-only routes (must be logged in)
    if (pathname.startsWith("/checkout")) {
      if (!token) {
        return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${pathname}`, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/owner") || pathname.startsWith("/admin")) return !!token;
        if (pathname.startsWith("/checkout")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/owner/:path*", "/admin/:path*", "/checkout"],
};