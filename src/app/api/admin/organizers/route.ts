import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { deserializeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  try {
    const session = deserializeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create organizers." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, string>;
    const user = await createUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      role: "ORGANIZER",
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create organizer." },
      { status: 400 },
    );
  }
}
