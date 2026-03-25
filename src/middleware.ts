import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for NextAuth API routes to prevent interference
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protect admin routes — redirect to /login if not authenticated
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // /admin/login page handles its own redirect
      return NextResponse.next();
    }
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Do NOT redirect /login or /signup from middleware —
  // let the page server components handle the redirect to avoid loops.
  // The login page already checks getSessionUser() and redirects if logged in.

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
