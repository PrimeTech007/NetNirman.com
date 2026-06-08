import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PREFIXES = [
  "/admin/login",
  "/api/auth",
];

async function getUserFromToken(req: NextRequest) {
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || "neobru-s3cr3t-k3y-f0r-n3xt-auth-jwt-2024-x9k2m"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    const user = await getUserFromToken(request);
    if (pathname === "/admin/login" && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Protect /admin/* routes
  if (pathname.startsWith("/admin")) {
    const user = await getUserFromToken(request);
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
