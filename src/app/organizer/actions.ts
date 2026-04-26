"use server";

import { getEventRegistrations } from "@/lib/db";

export async function fetchRegistrationsAction(eventId: string) {
  try {
    const registrations = await getEventRegistrations(eventId);
    return { success: true, registrations };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch registrations",
      registrations: []
    };
  }
}
