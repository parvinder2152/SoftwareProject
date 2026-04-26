"use server";

import { updateEvent } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deactivateEventAction(eventId: string) {
  try {
    await updateEvent(eventId, { status: "CANCELLED" });
    revalidatePath("/admin");
    revalidatePath("/student");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to deactivate event" };
  }
}
