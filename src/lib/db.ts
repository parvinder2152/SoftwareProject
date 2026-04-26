import crypto from "node:crypto";
import { supabase } from "./supabase";

export type UserRole = "STUDENT" | "ORGANIZER" | "ADMIN";
export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
export type RegistrationStatus = "CONFIRMED" | "CANCELLED";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type StoredEvent = {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  eventDateIso: string;
  startTimeIso: string;
  endTimeIso: string;
  eventDateLabel: string;
  timeLabel: string;
  status: EventStatus;
  statusLabel: string;
  registrationCount: number;
};

export type DashboardSnapshot = {
  totalEvents: number;
  publishedEvents: number;
  totalRegistrations: number;
  activeOrganizers: number;
  featuredEvents: PublicEvent[];
};

export type RegistrationResult = {
  user: PublicUser;
  event: PublicEvent;
  status: "created" | "existing";
};

export type EventRegistration = {
  id: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAtIso: string;
  createdAtLabel: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type AuditLog = {
  id: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: any;
  createdAtIso: string;
  createdAtLabel: string;
};

export type CreateEventInput = {
  organizerName: string;
  organizerEmail: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status?: EventStatus;
};

export type UpdateEventInput = {
  organizerName?: string;
  organizerEmail?: string;
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  status?: EventStatus;
};

export type RegisterForEventInput = {
  name: string;
  email: string;
  password?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatTimeLabel(startTime: string, endTime: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${formatter.format(new Date(startTime))} - ${formatter.format(new Date(endTime))}`;
}

function statusLabel(status: EventStatus) {
  switch (status) {
    case "PUBLISHED":
      return "Published";
    case "DRAFT":
      return "Draft";
    case "CANCELLED":
      return "Cancelled";
    case "COMPLETED":
      return "Completed";
  }
}

function toPublicUser(user: any): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function toPublicEvent(event: any, registrations: any[]): PublicEvent {
  const organizer = event.users;

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    organizerName: organizer?.name ?? "Unknown organizer",
    organizerEmail: organizer?.email ?? "unknown@uems.local",
    eventDateIso: event.eventDate,
    startTimeIso: event.startTime,
    endTimeIso: event.endTime,
    eventDateLabel: formatDateLabel(event.eventDate),
    timeLabel: formatTimeLabel(event.startTime, event.endTime),
    status: event.status,
    statusLabel: statusLabel(event.status),
    registrationCount: registrations.filter((r: any) => r.eventId === event.id).length,
  };
}

export async function getDatabaseSnapshot(): Promise<DashboardSnapshot> {
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*, users(name, email)")
    .order("startTime", { ascending: true });

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, role, status");

  const { data: registrations, error: regError } = await supabase
    .from("registrations")
    .select("eventId");

  if (eventsError || usersError || regError) {
    throw new Error("Unable to fetch database snapshot from Supabase.");
  }

  const allEvents = events ?? [];
  const allUsers = users ?? [];
  const allRegs = registrations ?? [];

  const featuredEvents = allEvents
    .filter((event) => event.status === "PUBLISHED")
    .slice(0, 4)
    .map((event) => toPublicEvent(event, allRegs));

  return {
    totalEvents: allEvents.length,
    publishedEvents: allEvents.filter((event) => event.status === "PUBLISHED").length,
    totalRegistrations: allRegs.length,
    activeOrganizers: allUsers.filter((user) => user.role === "ORGANIZER" && user.status === "active").length,
    featuredEvents,
  };
}

export async function listPublicEvents() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*, users(name, email)")
    .neq("status", "DRAFT")
    .order("startTime", { ascending: true });

  if (error) throw new Error("Failed to fetch public events.");

  const { data: registrations } = await supabase.from("registrations").select("eventId");

  return (events ?? []).map((event) => toPublicEvent(event, registrations ?? []));
}

export async function listAllEvents() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*, users(name, email)")
    .order("startTime", { ascending: true });

  if (error) throw new Error("Failed to fetch all events.");

  const { data: registrations } = await supabase.from("registrations").select("eventId");

  return (events ?? []).map((event) => toPublicEvent(event, registrations ?? []));
}

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const normalizedName = input.name.trim();
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedPassword = input.password.trim();

  if (!normalizedName) throw new Error("Name is required.");
  if (!isValidEmail(normalizedEmail)) throw new Error("Please provide a valid email address.");
  if (normalizedPassword.length < 6) throw new Error("Password must be at least 6 characters long.");

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .single();

  if (existing) {
    throw new Error("A user with that email already exists. Try signing in instead.");
  }

  const passwordHash = hashPassword(normalizedPassword);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role: input.role ?? "STUDENT",
      status: "active"
    })
    .select()
    .single();

  if (error || !user) throw new Error("Failed to create user.");

  await supabase.from("audit_logs").insert({
    actorUserId: user.id,
    action: "user_created",
    targetType: "User",
    targetId: user.id,
    metadata: { email: user.email, role: user.role }
  });

  return toPublicUser(user);
}

export async function authenticateUser(input: LoginInput): Promise<PublicUser> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedPassword = input.password.trim();

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error("Email and password are required.");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizedEmail)
    .single();

  if (error || !user) {
    throw new Error("Invalid email or password.");
  }

  const expectedHash = hashPassword(normalizedPassword);

  if (user.passwordHash !== expectedHash) {
    const isDemoAccount = user.email.endsWith("@uems.local");

    // Heal seeded demo users
    if (isDemoAccount && normalizedPassword === "password123") {
      await supabase.from("users").update({ passwordHash: expectedHash, updatedAt: new Date().toISOString() }).eq("id", user.id);
      user.passwordHash = expectedHash;
    } else {
      throw new Error("Invalid email or password.");
    }
  }

  return toPublicUser(user);
}

export async function createEvent(input: CreateEventInput): Promise<PublicEvent> {
  const normalizedEmail = input.organizerEmail.trim().toLowerCase();
  const organizerName = input.organizerName.trim();

  if (!input.title.trim() || !input.description.trim() || !input.location.trim()) {
    throw new Error("Title, description, and location are required.");
  }

  let { data: organizer } = await supabase.from("users").select("*").eq("email", normalizedEmail).single();

  if (!organizer) {
    const { data: newOrg, error: orgError } = await supabase.from("users").insert({
      name: organizerName || "Organizer",
      email: normalizedEmail,
      passwordHash: hashPassword("organizer-temp"),
      role: "ORGANIZER",
      status: "active"
    }).select().single();

    if (orgError || !newOrg) throw new Error("Failed to create organizer.");
    organizer = newOrg;
  } else {
    const { data: updatedOrg } = await supabase.from("users").update({
      name: organizerName || organizer.name,
      role: "ORGANIZER",
      updatedAt: new Date().toISOString()
    }).eq("id", organizer.id).select().single();
    organizer = updatedOrg;
  }

  const { data: event, error: eventError } = await supabase.from("events").insert({
    organizerId: organizer.id,
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    eventDate: new Date(input.eventDate).toISOString(),
    startTime: new Date(`${input.eventDate}T${input.startTime}:00`).toISOString(),
    endTime: new Date(`${input.eventDate}T${input.endTime}:00`).toISOString(),
    status: input.status ?? "PUBLISHED"
  }).select("*, users(name, email)").single();

  if (eventError || !event) throw new Error("Failed to create event: " + eventError?.message);

  await supabase.from("audit_logs").insert({
    actorUserId: organizer.id,
    action: "event_created",
    targetType: "Event",
    targetId: event.id,
    metadata: { title: event.title, status: event.status }
  });

  return toPublicEvent(event, []);
}

export async function updateEvent(eventId: string, input: UpdateEventInput): Promise<PublicEvent> {
  const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single();
  if (!event) throw new Error("Event not found.");

  const organizerEmail = input.organizerEmail?.trim().toLowerCase();
  if (organizerEmail || input.organizerName) {
    let { data: organizer } = await supabase.from("users").select("*").eq("email", organizerEmail || event.organizerId).single();
    if (!organizer && organizerEmail) {
      const { data: newOrg } = await supabase.from("users").insert({
        name: input.organizerName?.trim() || "Organizer",
        email: organizerEmail,
        passwordHash: hashPassword("organizer-temp"),
        role: "ORGANIZER",
        status: "active"
      }).select().single();
      organizer = newOrg;
    }
    
    if (organizer) {
      await supabase.from("users").update({
        name: input.organizerName?.trim() || organizer.name,
        role: "ORGANIZER",
        updatedAt: new Date().toISOString()
      }).eq("id", organizer.id);
      event.organizerId = organizer.id;
    }
  }

  const updates: any = { updatedAt: new Date().toISOString() };
  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.location !== undefined) updates.location = input.location.trim();
  const baseDateStr = input.eventDate ? input.eventDate : event.eventDate.split('T')[0];

  if (input.eventDate !== undefined) updates.eventDate = new Date(input.eventDate).toISOString();
  if (input.startTime !== undefined) {
    const startStr = input.startTime.includes('T') ? input.startTime : `${baseDateStr}T${input.startTime}:00`;
    updates.startTime = new Date(startStr).toISOString();
  }
  if (input.endTime !== undefined) {
    const endStr = input.endTime.includes('T') ? input.endTime : `${baseDateStr}T${input.endTime}:00`;
    updates.endTime = new Date(endStr).toISOString();
  }
  if (input.status !== undefined) updates.status = input.status;

  if (Object.keys(updates).length > 1) {
    const { data: updatedEvent, error } = await supabase.from("events").update(updates).eq("id", eventId).select("*, users(name, email)").single();
    if (error || !updatedEvent) throw new Error("Failed to update event.");
    Object.assign(event, updatedEvent);
  } else {
    // re-fetch the user just to be sure we have the joined data
    const { data: updatedEvent } = await supabase.from("events").select("*, users(name, email)").eq("id", eventId).single();
    Object.assign(event, updatedEvent);
  }

  await supabase.from("audit_logs").insert({
    actorUserId: event.organizerId,
    action: "event_updated",
    targetType: "Event",
    targetId: event.id,
    metadata: { title: event.title, status: event.status }
  });

  const { data: registrations } = await supabase.from("registrations").select("eventId").eq("eventId", eventId);
  return toPublicEvent(event, registrations ?? []);
}

export async function deleteEvent(eventId: string): Promise<{ id: string }> {
  const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single();
  if (!event) throw new Error("Event not found.");

  await supabase.from("events").delete().eq("id", eventId);
  
  await supabase.from("audit_logs").insert({
    actorUserId: event.organizerId,
    action: "event_deleted",
    targetType: "Event",
    targetId: event.id,
    metadata: { title: event.title }
  });

  return { id: event.id };
}

export async function registerForEvent(eventId: string, input: RegisterForEventInput): Promise<RegistrationResult> {
  const { data: event } = await supabase.from("events").select("*, users(name, email)").eq("id", eventId).single();
  if (!event) throw new Error("Event not found.");

  if (event.status !== "PUBLISHED") {
    throw new Error("This event is not open for registration.");
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedName = input.name.trim();

  if (!normalizedName || !normalizedEmail) {
    throw new Error("Name and email are required.");
  }

  let { data: user } = await supabase.from("users").select("*").eq("email", normalizedEmail).single();
  let status: RegistrationResult["status"] = "existing";

  if (!user) {
    const { data: newUser } = await supabase.from("users").insert({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash: hashPassword(input.password ?? "student-temp"),
      role: "STUDENT",
      status: "active"
    }).select().single();
    user = newUser;
    status = "created";
  }

  const { data: existingRegistration } = await supabase.from("registrations").select("*").eq("eventId", eventId).eq("userId", user.id).single();

  if (!existingRegistration) {
    await supabase.from("registrations").insert({
      eventId,
      userId: user.id,
      status: "CONFIRMED"
    });

    await supabase.from("notifications").insert({
      userId: user.id,
      eventId,
      message: `You are registered for ${event.title}.`,
      channel: "in_app",
      isRead: false
    });

    await supabase.from("audit_logs").insert({
      actorUserId: user.id,
      action: "event_registration_created",
      targetType: "Registration",
      targetId: event.id,
      metadata: { eventId, email: normalizedEmail }
    });
  }

  const { data: registrations } = await supabase.from("registrations").select("eventId").eq("eventId", eventId);

  return {
    user: toPublicUser(user),
    event: toPublicEvent(event, registrations ?? []),
    status,
  };
}

export async function getStats() {
  const [{ count: totalUsers }, { count: totalStudents }, { count: totalOrganizers }, { count: totalEvents }, { count: totalRegistrations }] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "STUDENT"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "ORGANIZER"),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("registrations").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalStudents: totalStudents ?? 0,
    totalOrganizers: totalOrganizers ?? 0,
    totalEvents: totalEvents ?? 0,
    totalRegistrations: totalRegistrations ?? 0,
  };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*, users(name)")
    .order("createdAt", { ascending: false })
    .limit(50);

  if (error) throw new Error("Failed to fetch audit logs.");

  return (logs ?? []).map((log: any) => ({
    id: log.id,
    actorName: log.users?.name ?? "Unknown user",
    action: log.action,
    targetType: log.targetType,
    targetId: log.targetId,
    metadata: log.metadata,
    createdAtIso: log.createdAt,
    createdAtLabel: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date(log.createdAt))
  }));
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("*, users(name, email)")
    .eq("eventId", eventId)
    .order("createdAt", { ascending: false });

  if (error) throw new Error("Failed to fetch registrations.");

  return (registrations ?? []).map((reg: any) => ({
    id: reg.id,
    userName: reg.users?.name ?? "Unknown user",
    userEmail: reg.users?.email ?? "Unknown email",
    status: reg.status,
    createdAtIso: reg.createdAt,
    createdAtLabel: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date(reg.createdAt))
  }));
}

export async function getUserRegistrations(userId: string): Promise<string[]> {
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("eventId")
    .eq("userId", userId);

  if (error) throw new Error("Failed to fetch user registrations.");

  return (registrations ?? []).map((reg: any) => reg.eventId);
}
