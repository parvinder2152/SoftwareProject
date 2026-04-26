import { NextRequest, NextResponse } from "next/server";
import {
  dashboardPathForRole,
  deserializeSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth-session";

function isPublicPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/auth");
}

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/student") ||
    pathname.startsWith("/organizer") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/events")
  );
}

function isRoleAllowed(pathname: string, role: "STUDENT" | "ORGANIZER" | "ADMIN") {
  if (role === "ADMIN") {
    return true; // Admins can access anything
  }

  if (role === "ORGANIZER") {
    return pathname.startsWith("/organizer") || pathname.startsWith("/events");
  }

  return pathname.startsWith("/student") || pathname.startsWith("/events");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = deserializeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    if (isProtectedPath(pathname)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/events" && session.role === "STUDENT") {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(dashboardPathForRole(session.role), request.url));
  }

  if (isPublicPath(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL(dashboardPathForRole(session.role), request.url));
  }

  if (isProtectedPath(pathname) && !isRoleAllowed(pathname, session.role)) {
    return NextResponse.redirect(new URL(dashboardPathForRole(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};