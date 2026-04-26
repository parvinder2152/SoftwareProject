import { NextRequest, NextResponse } from "next/server";
import { deleteEvent, updateEvent } from "@/lib/db";
import { deserializeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = deserializeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session || (session.role !== "ORGANIZER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only organizers or admins can update events." }, { status: 403 });
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, string>;
    const event = await updateEvent(id, {
      organizerName: body.organizerName,
      organizerEmail: body.organizerEmail,
      title: body.title,
      description: body.description,
      location: body.location,
      eventDate: body.eventDate,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status === "DRAFT" || body.status === "CANCELLED" || body.status === "COMPLETED" ? body.status : "PUBLISHED",
    });

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update event." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = deserializeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session || (session.role !== "ORGANIZER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only organizers or admins can delete events." }, { status: 403 });
    }

    const { id } = await params;
    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete event." },
      { status: 400 },
    );
  }
}