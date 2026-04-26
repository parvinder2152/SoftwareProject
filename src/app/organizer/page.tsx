import { listAllEvents } from "@/lib/db";
import EventCreateForm from "@/components/event-create-form";
import EventManagementPanel from "@/components/event-management-panel";
import { cookies } from "next/headers";
import { deserializeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export const dynamic = 'force-dynamic';

export default async function OrganizerPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  const session = sessionCookie ? deserializeSession(sessionCookie.value) : null;
  const events = await listAllEvents();

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Organizer Hub
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">Manage your events</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Create, refine, and communicate event details from one place. This dashboard now writes
          to the Supabase backend.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <EventCreateForm defaultName={session?.name} defaultEmail={session?.email} />
        <EventManagementPanel events={events} />
      </div>
    </section>
  );
}
