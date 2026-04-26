import { NextRequest, NextResponse } from "next/server";
import { createEvent, listAllEvents } from "@/lib/db";
import { deserializeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export async function GET() {
  const events = await listAllEvents();
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  try {
    const session = deserializeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session || (session.role !== "ORGANIZER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only organizers or admins can create events." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, string>;
    const event = await createEvent({
      organizerName: body.organizerName ?? session.name,
      organizerEmail: body.organizerEmail ?? session.email,
      title: body.title ?? "",
      description: body.description ?? "",
      location: body.location ?? "",
      eventDate: body.eventDate ?? "",
      startTime: body.startTime ?? "",
      endTime: body.endTime ?? "",
      status: body.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create event." },
      { status: 400 },
    );
  }
}
