import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/db";
import {
  dashboardPathForRole,
  SESSION_COOKIE_NAME,
  serializeSession,
} from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const user = await authenticateUser({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    const response = NextResponse.json({
      user,
      redirectTo: dashboardPathForRole(user.role),
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: serializeSession(user),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to sign in." },
      { status: 400 },
    );
  }
}
