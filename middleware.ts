import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-based route access configuration
const ROLE_ROUTE_PREFIXES: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/hod": ["HOD", "ADMIN"],
  "/teacher": ["TEACHER", "HOD", "ADMIN"],
  "/student": ["STUDENT"],
  "/accounts": ["ACCOUNTS", "ADMIN"],
  "/management": ["MANAGEMENT", "ADMIN"],
};

function parseJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find matching protected prefix
  const matchingPrefix = Object.keys(ROLE_ROUTE_PREFIXES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchingPrefix) {
    return NextResponse.next();
  }

  const token = request.cookies.get("univ_session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = parseJwtPayload(token);

  if (!session || !session.role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("univ_session");
    return response;
  }

  // Check token expiration
  if (session.exp && Date.now() >= session.exp * 1000) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("expired", "1");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("univ_session");
    return response;
  }

  const allowedRoles = ROLE_ROUTE_PREFIXES[matchingPrefix];
  const userRole = session.role as string;

  if (!allowedRoles.includes(userRole)) {
    // Redirect to their own dashboard if authorized for their role
    const userDashboard = `/${userRole.toLowerCase()}/dashboard`;
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hod/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/accounts/:path*",
    "/management/:path*",
  ],
};
