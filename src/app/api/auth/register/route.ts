import { NextResponse } from "next/server";
import { createUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const user = await createUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      role: "STUDENT",
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 },
    );
  }
}
