import { NextRequest, NextResponse } from "next/server";
import { registerForEvent } from "@/lib/db";
import { deserializeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = deserializeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can register for events." }, { status: 403 });
    }

    const { id } = await params;
    const result = await registerForEvent(id, {
      name: session.name,
      email: session.email,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register for the event." },
      { status: 400 },
    );
  }
}