import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { consumeRateLimit, getClientIp } from "@/lib/rateLimit";

type RateLimitRule = {
  key: string;
  limit: number;
  windowMs: number;
};

function getRateLimitRule(req: NextRequest): RateLimitRule | null {
  const { pathname } = req.nextUrl;

  if (req.method === "POST" && pathname === "/api/contact") {
    return { key: "contact", limit: 5, windowMs: 15 * 60 * 1000 };
  }

  if (req.method === "POST" && pathname === "/api/auth/signup") {
    return { key: "signup", limit: 5, windowMs: 60 * 60 * 1000 };
  }

  if (
    req.method === "POST" &&
    (pathname === "/api/auth/callback/credentials" || pathname === "/api/auth/signin/credentials")
  ) {
    return { key: "login", limit: 10, windowMs: 15 * 60 * 1000 };
  }

  if (pathname === "/api/seed") {
    return { key: "seed", limit: 3, windowMs: 10 * 60 * 1000 };
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rateLimitRule = getRateLimitRule(req);

  if (rateLimitRule) {
    const ip = getClientIp(req.headers);
    const result = consumeRateLimit({
      key: `${rateLimitRule.key}:${ip}`,
      limit: rateLimitRule.limit,
      windowMs: rateLimitRule.windowMs,
    });

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfterSeconds),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.resetAt),
          },
        }
      );
    }
  }

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
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*", "/api/contact", "/api/seed"],
};
